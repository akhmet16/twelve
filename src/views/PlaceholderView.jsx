export default function PlaceholderView({ title }) {
  return (
    <div className="flex-1 h-full flex items-center justify-center">
      <span className="text-text-muted text-sm font-medium tracking-wide">
        {title}
      </span>
    </div>
  )
}
