function PageHeader({ title, description, icon }) {
  return (
    <div className="mb-6 min-w-0 sm:mb-8">
      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
        {/* Page icon */}
        <div className="shrink-0 pt-1 text-3xl text-blue-500 sm:pt-0 sm:text-4xl">
          {icon}
        </div>

        {/* Title and description */}
        <div className="min-w-0 flex-1">
          <h1 className="break-words text-3xl font-bold leading-tight text-blue-500 sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-2 break-words text-sm leading-relaxed text-gray-400 sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
