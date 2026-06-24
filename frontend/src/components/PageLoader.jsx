export default function PageLoader() {
    return (
        <div className="mt-4 flex flex-col justify-center items-center h-screen gap-4">
            <div className="flex items-end gap-1 h-10">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 rounded-full bg-emerald-500 animate-pulse"
                        style={{
                            height: `${12 + (i % 3) * 10}px`,
                            animationDelay: `${i * 120}ms`,
                            animationDuration: "800ms",
                        }}
                    />
                ))}
            </div>

            <p className="-mt-2 text-sm text-slate-500 tracking-wide">Loading...</p>
        </div>
    );
}
