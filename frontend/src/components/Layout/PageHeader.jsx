function PageHeader({ title, description, icon }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="text-4xl text-blue-500">
          {icon}
        </div>

        <div>
          <h1 className="text-5xl font-bold text-blue-500">
            {title}
          </h1>

          <p className="text-gray-400 mt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;