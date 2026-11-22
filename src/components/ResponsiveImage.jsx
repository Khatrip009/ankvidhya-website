/**
 * Responsive, layout-stable image component for the Ankvidhya website.
 * Pass an image object from SITE_IMAGES. Hero images can use priority=true.
 */
export default function ResponsiveImage({
  image,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw",
  objectFit = "cover",
  ...props
}) {
  if (!image?.src) return null;

  return (
    <img
      src={image.src}
      alt={image.alt || ""}
      width={image.width}
      height={image.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      sizes={sizes}
      className={`block h-auto w-full ${objectFit === "contain" ? "object-contain" : "object-cover"} ${className}`}
      {...props}
    />
  );
}
