<div className="pt-4">
  <h2 className="text-lg font-medium text-gray-800 mb-4">Education</h2>

  {formData.education.map((edu, index) => (
    <div key={index} className="mb-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Education {index + 1}</h3>
        {formData.education.length > 1 && (
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Degree */}
        <div>
          <label
            htmlFor={`education-degree-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Degree:
          </label>
          <input
            type="text"
            id={`education-degree-${index}`}
            value={edu.degree}
            onChange={(e) =>
              handleEducationChange(index, "degree", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education?.[index]?.degree ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., Bachelor of Science"
          />
        </div>

        {/* Institution */}
        <div>
          <label
            htmlFor={`education-institution-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Institution:
          </label>
          <input
            type="text"
            id={`education-institution-${index}`}
            value={edu.institution}
            onChange={(e) =>
              handleEducationChange(index, "institution", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education?.[index]?.institution ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., University Name"
          />
        </div>

        {/* Field of Study */}
        <div>
          <label
            htmlFor={`education-field-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Field of Study:
          </label>
          <input
            type="text"
            id={`education-field-${index}`}
            value={edu.field}
            onChange={(e) =>
              handleEducationChange(index, "field", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education?.[index]?.field ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., Computer Science"
          />
        </div>

        {/* Year */}
        <div>
          <label
            htmlFor={`education-year-${index}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Year:
          </label>
          <input
            type="text"
            id={`education-year-${index}`}
            value={edu.year}
            onChange={(e) =>
              handleEducationChange(index, "year", e.target.value)
            }
            className={`w-full p-3 bg-gray-50 border ${
              errors.education?.[index]?.year ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
            placeholder="e.g., 2024"
          />
        </div>
      </div>
    </div>
  ))}

  {/* Add Education Button */}
  <button
    type="button"
    onClick={addEducation}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  >
    Add Education
  </button>

  {/* General Education Errors */}
  {typeof errors.education === "string" && (
    <p className="mt-1 text-sm text-red-500">{errors.education}</p>
  )}
</div>
