'use client';

import { useParams } from "next/navigation";
import { useState, useEffect, FormEvent, useRef } from "react";
import { ArrowUp, ArrowDown, Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface Resource {
  id?: number;
  resourceName: string;
  resourceUrl: string;
  resourceType: string;
  order: number;
  chapterId: string;
}

interface ResourceType {
  id: number;
  typeName: string;
}

interface ResourceForm {
  resourceType: string;
  resourceName: string;
  order: string;
  file: File | null;
  youtubelink: string;
}

export default function UploadChapterResourcePage() {
    const router = useRouter(); 
  const params = useParams();
  const chapterId = params.chapterId as string;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const BACKEND_URL = "https://d1ojm6zdv3m37g.cloudfront.net";

  const [resourceForm, setResourceForm] = useState<ResourceForm>({
    resourceType: "",
    resourceName: "",
    order: "1",
    file: null,
    youtubelink: "",
  });

  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resourceTypeMap, setResourceTypeMap] = useState<Record<string, number>>({});
  // Fetch resource types and resources
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/resource-types`);
        if (!response.ok) throw new Error("Failed to fetch resource types");
        const data: ResourceType[] = await response.json();
        const uniqueTypes = Array.from(
          new Set(data.map((type) => type.typeName.toLowerCase()))
        );
        setResourceTypes(uniqueTypes);
      } catch (err: any) {
        console.error("Error fetching resource types:", err);
        setError("Failed to load resource types. Using default types.");
        setResourceTypes(["thumbnail", "ppt", "youtubelink", "pdf", "word", "audio", "video"]);
      }
    };

    fetchResourceTypes();
    if (chapterId) fetchResources();
  }, [chapterId]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/chapter-resources/chapter/${chapterId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch resources");
      }
      const data = await response.json();
//const data = await response.json();
const extractFileName = (url: string) => {
  if (!url) return "Unnamed Resource";
  try {
    return decodeURIComponent(url.split("/").pop() || "Unnamed Resource");
  } catch {
    return "Unnamed Resource";
  }
};
console.log("Resources from API:", data);
setResources(
  data.map((r: any) => ({
    id: r.id,
    resourceName: r.resourceName, // Make sure this key exists
    resourceUrl: r.resource_url ?? "",
    resourceType: r.resourceType?.typeName ?? "",
    order: Number(r.order) || 0,
  }))
);
// const extractFileName = (url: string) => {
//   if (!url) return "Unnamed Resource";
//   try {
//     return decodeURIComponent(url.split("/").pop() || "Unnamed Resource");
//   } catch {
//     return "Unnamed Resource";
//   }
// };


    } catch (err: any) {
      setError(err.message || "Failed to load resources.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResourceForm((prev) => ({ ...prev, file }));
  };

  // Controlled resource type change
  const handleResourceTypeChange = (type: string) => {
    setResourceForm((prev) => ({
      resourceType: type,
      resourceName: prev.resourceName,
      order: prev.order,
      file: type === "youtubelink" ? null : prev.file,
      youtubelink: type === "youtubelink" ? prev.youtubelink : "",
    }));

    // Reset file input when switching away from file type
    if (fileInputRef.current && type === "youtubelink") {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!chapterId) {
      setError("Invalid chapter ID");
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

    if (resources.some((r) => r.order === orderNum)) {
      setError(`Order ${orderNum} is already used. Please choose a unique order.`);
      return;
    }

    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("chapterId", chapterId);
    formData.append("resourceName", resourceForm.resourceName);
    formData.append("order", resourceForm.order);

    // Map resourceType string to numeric ID
    const selectedType = resourceTypes.find(
      (t) => t.toLowerCase() === resourceForm.resourceType.toLowerCase()
    );
    if (!selectedType) {
      setError("Invalid resource type selected");
      setIsSubmitting(false);
      return;
    }

    formData.append("resourceTypeId", (resourceTypes.indexOf(selectedType) + 1).toString());

    if (resourceForm.resourceType === "youtubelink") {
      formData.append("resourceUrl", resourceForm.youtubelink);
    } else if (resourceForm.file) {
      formData.append("file", resourceForm.file);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/chapter-resources/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload resource");
      }

      await fetchResources();
      setResourceForm({
        resourceType: "",
        resourceName: "",
        order: "1",
        file: null,
        youtubelink: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload resource. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/chapter-resources/${id}`, { method: "DELETE" });
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
  if ((direction === "up" && index === 0) || (direction === "down" && index === resources.length - 1)) return;

  const newResources = [...resources];
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  // Swap orders
  [newResources[index].order, newResources[targetIndex].order] = [
    newResources[targetIndex].order,
    newResources[index].order,
  ];

  setResources(newResources.sort((a, b) => a.order - b.order)); // ⚡ update immediately

  try {
    const response = await fetch(`${BACKEND_URL}/chapter-resources/reorder`, {
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
  } catch (err: any) {
    setError(err.message || "Failed to reorder resources.");
  }
};



  const handlePreview = (url: string) => {
    const absoluteUrl = url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
    window.open(absoluteUrl, "_blank");
  };

  if (!chapterId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error: No Chapter ID Provided</h2>
          <p className="text-gray-600">Please create a chapter first to add resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100  p-4 font-sans">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add Resources for Chapters: <span className="text-blue-600"></span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          {/* Resource Type */}
          <div>
            <label htmlFor="resourceType" className="block text-lg font-semibold text-gray-700 mb-2">
              Resource Type <span className="text-red-500">*</span>
            </label>
            <select
              id="resourceType"
              value={resourceForm.resourceType}
              onChange={(e) => handleResourceTypeChange(e.target.value)}
              required
              className="form-select"
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
                onChange={(e) =>
                  setResourceForm((prev) => ({ ...prev, resourceName: e.target.value }))
                }
                placeholder="Enter resource name"
                required
                className="form-control"
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
                onChange={(e) =>
                  setResourceForm((prev) => ({ ...prev, order: e.target.value }))
                }
                placeholder="Enter unique order"
                min="1"
                required
                className="form-control"
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
                onChange={(e) =>
                  setResourceForm((prev) => ({ ...prev, youtubelink: e.target.value }))
                }
                placeholder="Enter YouTube URL"
                required
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                ref={fileInputRef}
                onChange={handleFileChange}
                key={resourceForm.resourceType} // important to reset input when type changes
                required={resourceForm.resourceType !== "youtubelink"}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
            </div>
          )}

 <div className="flex justify-end gap-2 mb-4">
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => router.back()}
  >
    Close
  </button>

  <button
    type="submit"
    disabled={isSubmitting}
    className="btn btn-primary"
  >
    {isSubmitting ? "Uploading..." : "Add Resource"}
  </button>
</div>


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
                        <button onClick={() => handlePreview(resource.resourceUrl)} className="text-blue-600 hover:text-blue-800" title="Preview">
                          <Eye size={20} />
                        </button>
                        <button onClick={() => resource.id && handleDelete(resource.id)} className="text-red-600 hover:text-red-800" title="Delete">
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