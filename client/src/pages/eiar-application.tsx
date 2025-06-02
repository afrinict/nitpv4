import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';

interface EIARApplication {
  projectName: string;
  location: string;
  description: string;
  environmentalImpact: string;
  mitigationMeasures: string;
  documents: string[];
  images: string[];
  maps: string[];
}

const EIARApplication: React.FC = () => {
  const [formData, setFormData] = useState<EIARApplication>({
    projectName: '',
    location: '',
    description: '',
    environmentalImpact: '',
    mitigationMeasures: '',
    documents: [],
    images: [],
    maps: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };

  const handleDocumentsUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...urls]
    }));
  };

  const handleMapsUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      maps: [...prev.maps, ...urls]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Environmental Impact Assessment Report Application</h1>
          <p className="mt-4 text-lg text-gray-600">
            Please fill out the form below to submit your Environmental Impact Assessment Report application.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            {/* Project Details */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Project Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="environmentalImpact" className="block text-sm font-medium text-gray-700">
                Environmental Impact Assessment
              </label>
              <textarea
                id="environmentalImpact"
                name="environmentalImpact"
                value={formData.environmentalImpact}
                onChange={handleInputChange}
                required
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the potential environmental impacts of the project..."
              />
            </div>

            <div>
              <label htmlFor="mitigationMeasures" className="block text-sm font-medium text-gray-700">
                Mitigation Measures
              </label>
              <textarea
                id="mitigationMeasures"
                name="mitigationMeasures"
                value={formData.mitigationMeasures}
                onChange={handleInputChange}
                required
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe the measures to mitigate environmental impacts..."
              />
            </div>

            {/* Site Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Images
              </label>
              <ImageUpload
                onImageUploaded={handleImagesUploaded}
                multiple={true}
                maxFiles={10}
                maxSize={10}
                label="Upload Site Images"
                description="Upload images of the site and surrounding environment"
                className="mb-4"
              />
              {formData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.images.length} image(s) uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Maps and Plans */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maps and Plans
              </label>
              <ImageUpload
                onImageUploaded={handleMapsUploaded}
                multiple={true}
                maxFiles={5}
                maxSize={20}
                label="Upload Maps and Plans"
                description="Upload site maps, plans, and other spatial documents"
                className="mb-4"
              />
              {formData.maps.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.maps.length} map(s) uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents
              </label>
              <ImageUpload
                onImageUploaded={handleDocumentsUploaded}
                multiple={true}
                maxFiles={5}
                maxSize={20}
                label="Upload Documents"
                description="Upload supporting documents (PDF, DOC, DOCX)"
                allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                className="mb-4"
              />
              {formData.documents.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.documents.length} document(s) uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EIARApplication; 