"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Properties() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const properties = [
    {
      id: 1,
      labelKey: "properties.courses",
      position: "top-left",
      imageBg: "from-amber-200 to-amber-400",
      delay: "100",
    },
    {
      id: 2,
      labelKey: "properties.privateLessons",
      position: "bottom-left",
      imageBg: "from-blue-200 to-blue-400",
      delay: "200",
    },
    {
      id: 3,
      labelKey: "properties.inquiry",
      position: "top-right",
      imageBg: "from-gray-200 to-gray-400",
      delay: "300",
    },
    {
      id: 4,
      labelKey: "properties.research",
      position: "bottom-right",
      imageBg: "from-purple-200 to-purple-400",
      delay: "400",
    },
  ];

  return (
    <section className="px-8 py-16">
      <div className="flex flex-col items-center gap-4">
        <h2 className={`text-4xl font-bold ${theme === "dark" ? "text-white" : "text-blue-950"}`}>{t("properties.title")}</h2>
        <p className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-700"}`}>{t("properties.subtitle")}</p>

        {/* Grid layout for properties - 4 circles */}
        <div className="relative mt-16 h-96 w-full max-w-7xl mx-auto">
          {properties.map((property) => {
            let positionClasses = "";
            if (property.position === "top-left") {
              positionClasses = "absolute left-0 top-0";
            } else if (property.position === "bottom-left") {
              positionClasses = "absolute bottom-0 left-80";
            } else if (property.position === "top-right") {
              positionClasses = "absolute right-80 top-0";
            } else if (property.position === "bottom-right") {
              positionClasses = "absolute bottom-0 right-0";
            }

            return (
              <div key={property.id} className={positionClasses}>
                <div className={`relative h-48 w-48 animate-scale-in animate-delay-${property.delay} hover:scale-110 transition-transform duration-300 cursor-pointer`}>
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed ${theme === "dark" ? "border-white" : "border-blue-950"} animate-fade-in-up`}></div>
                  <div className={`absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] rounded-full overflow-hidden bg-linear-to-b ${property.imageBg} animate-fade-in-up`}>
                    <div className="h-full w-full bg-gray-200"></div>
                  </div>
                  <div className={`absolute right-2 top-8 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-500"} px-4 py-2 animate-fade-in-up shadow-lg`}>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-white"}`}>{t(property.labelKey)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

