"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { ArrowUp, ArrowDown, Eye, Trash } from "lucide-react";

interface Resource {
  id?: number;
  resourceName: string;
  resourceUrl: string;
  resourceType: string;
  order: number;
}

// Define the shape of the resource type data from the backend
interface ResourceType {
  id: number;
  typeName: string;
}

export default function UploadResourcePage() {
  const searchParams = useSearchParams();
  const webinarId = searchParams.get("webinarId");

  const [resourceForm, setResourceForm] = useState({
    resourceType: "",
    resourceName: "",
    order: "",
    file: null as File | null,
    youtubelink: "",
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const BACKEND_URL = "http://localhost:3000"; // NestJS backend URL

  // Fetch resource types and existing resources on mount
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/resource-types`);
        if (!response.ok) throw new Error("Failed to fetch resource types");
        const data: ResourceType[] = await response.json(); // Type the data
        const uniqueTypes = Array.from(new Set(data.map((type) => type.typeName.toLowerCase())));
        console.log("Fetched Resource Types:", uniqueTypes); // Log to verify
        setResourceTypes(uniqueTypes);
      } catch (err: any) {
        console.error("Error fetching resource types:", err);
        setError("Failed to load resource types. Using default types.");
        setResourceTypes(["thumbnail", "ppt", "youtubelink", "pdf", "word", "audio", "video"]);
      }
    };

    fetchResourceTypes();

    if (webinarId) {
      fetchResources();
    }
  }, [webinarId]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/webinar-resources/webinar/${webinarId}`, {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch resources");
      }
      const data = await response.json();
      setResources(
        data.map((r: any) => ({
          id: r.id,
          resourceName: r.resourceName,
          resourceUrl: r.resourceUrl,
          resourceType: r.resourceType.typeName,
          order: r.order,
        }))
      );
    } catch (err: any) {
      setError(err.message || "Failed to load resources.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResourceForm((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!webinarId) {
      setError("Invalid webinar ID");
      return;
    }
    if (!resourceForm.resourceType || !resourceForm.resourceName || !resourceForm.order) {
      setError("Please fill all required fields");
      return;
    }
    if (resourceForm.resourceType !== "youtubelink" && !resourceForm.file) {
      setError("Please select a file");
      return;
    }
    if (resourceForm.resourceType === "youtubelink" && !resourceForm.youtubelink) {
      setError("Please enter a YouTube link");
      return;
    }
    const orderNum = parseInt(resourceForm.order);
    if (isNaN(orderNum) || orderNum < 1) {
      setError("Order must be a positive number");
      return;
    }
      // ✅ Check if order is unique
  const duplicateOrder = resources.some((r) => r.order === orderNum);
  if (duplicateOrder) {
    setError(`Order ${orderNum} is already used. Please choose a unique order.`);
    return;
  }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("webinarId", webinarId);
    formData.append("resourceName", resourceForm.resourceName);
    formData.append("resourceType", resourceForm.resourceType);
    formData.append("order", resourceForm.order);
    if (resourceForm.resourceType === "youtubelink") {
      formData.append("resourceUrl", resourceForm.youtubelink);
    } else if (resourceForm.file) {
      formData.append("file", resourceForm.file);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/webinar-resources/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload resource");
      }

      await fetchResources(); // Refresh resource list
      setResourceForm({
        resourceType: "",
        resourceName: "",
        order: "",
        file: null,
        youtubelink: "",
      });
      (document.getElementById("file") as HTMLInputElement).value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/webinar-resources/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete resource");
      }
      await fetchResources();
    } catch (err: any) {
      setError(err.message || "Failed to delete resource.");
    }
  };

  const handleMove = async (id: number, direction: "up" | "down") => {
    const index = resources.findIndex((r) => r.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === resources.length - 1)
    ) {
      return;
    }

    const newResources = [...resources];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newResources[index].order, newResources[targetIndex].order] = [
      newResources[targetIndex].order,
      newResources[index].order,
    ];

    try {
      const response = await fetch(`${BACKEND_URL}/webinar-resources/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId1: newResources[index].id,
          order1: newResources[index].order,
          resourceId2: newResources[targetIndex].id,
          order2: newResources[targetIndex].order,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reorder resources");
      }
      await fetchResources();
    } catch (err: any) {
      setError(err.message || "Failed to reorder resources.");
    }
  };

  const handlePreview = (url: string) => {
    const absoluteUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
    window.open(absoluteUrl, "_blank");
  };

  if (!webinarId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error: No Webinar ID Provided</h2>
          <p className="text-gray-600">Please create a webinar first to add resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add Resources for Webinar ID: <span className="text-blue-600">{webinarId}</span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label htmlFor="resourceType" className="block text-lg font-semibold text-gray-700 mb-2">
              Resource Type <span className="text-red-500">*</span>
            </label>
            <select
              id="resourceType"
              value={resourceForm.resourceType}
              onChange={(e) => setResourceForm((prev) => ({ ...prev, resourceType: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Select a type</option>
              {resourceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="resourceName" className="block text-lg font-semibold text-gray-700 mb-2">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="resourceName"
                value={resourceForm.resourceName}
                onChange={(e) => setResourceForm((prev) => ({ ...prev, resourceName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter resource name"
                required
              />
            </div>
            <div>
              <label htmlFor="order" className="block text-lg font-semibold text-gray-700 mb-2">
                Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="order"
                value={resourceForm.order}
                onChange={(e) => setResourceForm((prev) => ({ ...prev, order: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter unique order"
                min="1"
                required
              />
            </div>
          </div>

          {resourceForm.resourceType === "youtubelink" ? (
            <div>
              <label htmlFor="youtubelink" className="block text-lg font-semibold text-gray-700 mb-2">
                YouTube Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="youtubelink"
                value={resourceForm.youtubelink}
                onChange={(e) => setResourceForm((prev) => ({ ...prev, youtubelink: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter YouTube URL"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="file" className="block text-lg font-semibold text-gray-700 mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Add Resource"
            )}
          </button>
        </form>

        {resources.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Resource Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources
                  .sort((a, b) => a.order - b.order)
                  .map((resource) => (
                    <tr key={resource.id} className="border-t">
                      <td className="px-6 py-4 text-sm text-gray-600">{resource.order}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{resource.resourceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handlePreview(resource.resourceUrl)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Preview"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => resource.id && handleDelete(resource.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash size={20} />
                        </button>
                        <button
                          onClick={() => resource.id && handleMove(resource.id, "up")}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          disabled={resources[0].id === resource.id}
                          title="Move Up"
                        >
                          <ArrowUp size={20} />
                        </button>
                        <button
                          onClick={() => resource.id && handleMove(resource.id, "down")}
                          className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                          disabled={resources[resources.length - 1].id === resource.id}
                          title="Move Down"
                        >
                          <ArrowDown size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}