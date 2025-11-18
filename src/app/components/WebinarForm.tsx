'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { UserIcon } from 'lucide-react';

const CKEditorClient = dynamic(() => import('@/app/components/CKEditorClient'), {
  ssr: false,
});

export interface WebinarFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string | number;
  teacherId: string | number;
  packageIds: number[];
  isRecurring: boolean;
  recurringType?: string;
  meetingLink: string;
  registration?: boolean;
  restrictToRegistered?: boolean;
  tags?: string;
}

interface PackageItem {
  id?: number;
  title?: string;
  name?: string;
  packageName?: string;
}

interface WebinarFormProps {
  initialData?: Partial<WebinarFormData>;
  onSubmit: (formData: FormData) => Promise<{ id: number }>;
  loggedInUserId: number | string;
  packagesList?: PackageItem[];
}

export default function WebinarForm({
  initialData,
  onSubmit,
  loggedInUserId,
  packagesList = [],
}: WebinarFormProps) {
  const router = useRouter();

  // Controlled states
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [form, setForm] = useState<WebinarFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    teacherId: loggedInUserId ?? '',
    packageIds: [],
    isRecurring: false,
    recurringType: '',
    meetingLink: '',
    registration: false,
    restrictToRegistered: false,
    tags: '',
    ...initialData,
  });

  const [packages, setPackages] = useState<PackageItem[]>(packagesList);
  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync teacher ID
  useEffect(() => {
    setForm((prev) => ({ ...prev, teacherId: loggedInUserId }));
  }, [loggedInUserId]);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        await new Promise((r) => setTimeout(r, 500));
        token = localStorage.getItem('accessToken');
      }
      if (!token) return setLoading(false);

      try {
        const res = await axios.get('http://localhost:3000/packages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(res.data);
      } catch (err) {
        console.error(err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!form.packageIds.length) newErrors.packageIds = 'Select at least one package';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.duration || Number(form.duration) <= 0)
      newErrors.duration = 'Duration must be positive';
    if (!form.teacherId) newErrors.teacherId = 'Teacher ID required';
    if (!form.meetingLink?.trim()) newErrors.meetingLink = 'Meeting link required';
    if (form.isRecurring && !form.recurringType)
      newErrors.recurringType = 'Select a recurring type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (
    e: FormEvent | React.MouseEvent,
    redirectTo: 'listing' | 'resource'
  ) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries({ ...form, title, description }).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((v) => formData.append(key, String(v)));
        else if (value !== undefined && value !== null) formData.append(key, String(value));
      });

      if (thumbnail) formData.append('thumbnail', thumbnail);

      const res = await onSubmit(formData);
      const webinarId = res?.id;
      if (!webinarId) throw new Error('Missing webinar ID in response');

      if (redirectTo === 'listing') router.push('/dashboard/webinars');
      else router.push(`/upload-resource?webinarId=${webinarId}`);
    } catch (err: any) {
      console.error('submit error', err);
      setErrors({ form: err?.message ?? 'Failed to create webinar' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading packages...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Create New Webinar
      </h2>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.form}
        </div>
      )}

      {/* ✅ SINGLE FORM TAG */}

      {/* ✅ Multi-package select */}
      <div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Packages <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.packageIds.length > 0 ? (
              form.packageIds.map((id) => {
                const pkg = packages.find((p) => p.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {pkg?.packageName ?? pkg?.title ?? pkg?.name ?? `Package ${id}`}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          packageIds: prev.packageIds.filter((pid) => pid !== id),
                        }))
                      }
                      className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No packages selected</p>
            )}
          </div>
         </div>
          <select
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              if (selectedId && !form.packageIds.includes(selectedId)) {
                setForm((prev) => ({
                  ...prev,
                  packageIds: [...prev.packageIds, selectedId],
                }));
              }
              e.target.value = '';
            }}
            value=""
            className={`w-full p-2 border rounded shadow-sm ${
              errors.packageIds ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select a package --</option>
            {packages
              .filter((pkg) => !form.packageIds.includes(pkg.id!))
              .map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.packageName ?? pkg.title ?? pkg.name ?? `Package ${pkg.id}`}
                </option>
              ))}
          </select>
          {errors.packageIds && (
            <p className="text-sm text-red-600 mt-1">{errors.packageIds}</p>
          )}
        </div>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Webinar Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : ''
            }`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <CKEditorClient value={description} onChange={(data) => setDescription(data)} />
        </div>

        {/* Teacher ID
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
          <div className="relative">
            <input
              type="number"
              value={form.teacherId}
              readOnly
              className="w-full p-2 border rounded-md shadow-sm pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <UserIcon size={16} />
            </div>
          </div>
        </div> */}

        {/* ✅ Multi-package select
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Packages <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.packageIds.length > 0 ? (
              form.packageIds.map((id) => {
                const pkg = packages.find((p) => p.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {pkg?.packageName ?? pkg?.title ?? pkg?.name ?? `Package ${id}`}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          packageIds: prev.packageIds.filter((pid) => pid !== id),
                        }))
                      }
                      className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
                    >
                      ×
                    </button>
                  </span>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No packages selected</p>
            )}
          </div>

          <select
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              if (selectedId && !form.packageIds.includes(selectedId)) {
                setForm((prev) => ({
                  ...prev,
                  packageIds: [...prev.packageIds, selectedId],
                }));
              }
              e.target.value = '';
            }}
            value=""
            className={`w-full p-2 border rounded shadow-sm ${
              errors.packageIds ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select a package --</option>
            {packages
              .filter((pkg) => !form.packageIds.includes(pkg.id!))
              .map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.packageName ?? pkg.title ?? pkg.name ?? `Package ${pkg.id}`}
                </option>
              ))}
          </select>
          {errors.packageIds && (
            <p className="text-sm text-red-600 mt-1">{errors.packageIds}</p>
          )}
        </div> */}

        {/* Date, Time, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md shadow-sm ${
                errors.date ? 'border-red-500' : ''
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md shadow-sm ${
                errors.time ? 'border-red-500' : ''
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md shadow-sm ${
                errors.duration ? 'border-red-500' : ''
              }`}
            />
          </div>
        </div>

        {/* Meeting Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Link
          </label>
          <input
            type="url"
            name="meetingLink"
            value={form.meetingLink}
            onChange={handleChange}
            placeholder="https://zoom.us/..."
            className={`w-full p-2 border rounded-md shadow-sm ${
              errors.meetingLink ? 'border-red-500' : ''
            }`}
          />
        </div>

        {/* Recurring & Registration */}
        <div>
          <label className="inline-flex items-center">
            <input
              name="isRecurring"
              type="checkbox"
              checked={form.isRecurring}
              onChange={handleChange}
              className="mr-2"
            />
            Recurring Webinar
          </label>
          {form.isRecurring && (
            <select
              name="recurringType"
              value={form.recurringType || ''}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Select Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          )}
        </div>

        <div>
          <label className="inline-flex items-center mr-4">
            <input
              name="registration"
              type="checkbox"
              checked={!!form.registration}
              onChange={handleChange}
              className="mr-2"
            />
            Enable Registration
          </label>
          {form.registration && (
            <div className="mt-2">
              <label className="inline-flex items-center mr-4">
                <input
                  name="restrictToRegistered"
                  type="checkbox"
                  checked={!!form.restrictToRegistered}
                  onChange={handleChange}
                  className="mr-2"
                />
                Restrict to Registered
              </label>
              <input
                name="tags"
                placeholder="Allowed tags (comma separated)"
                value={String(form.tags ?? '')}
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => handleFormSubmit(e, 'listing')}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white p-2 rounded"
          >
            {isSubmitting ? 'Creating...' : 'Create Webinar'}
          </button>
          <button
            type="button"
            onClick={(e) => handleFormSubmit(e, 'resource')}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white p-2 rounded"
          >
            {isSubmitting ? 'Creating...' : 'Create & Add Resources'}
          </button>
        </div>
      </form>
    </div>
  );
}
