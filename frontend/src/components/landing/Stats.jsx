export default function Stats() {
    return (
        <section className="py-12 border-y border-white/5 bg-surface-container-lowest/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-1">
                        <div className="text-4xl font-bold font-headline text-white tracking-tighter">500M+</div>
                        <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Minutes Transcribed</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-4xl font-bold font-headline text-secondary tracking-tighter">99.2%</div>
                        <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Accuracy Rate</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-4xl font-bold font-headline text-white tracking-tighter">&lt; 30s</div>
                        <div className="text-sm text-gray-500 font-medium tracking-widest uppercase">Turnaround Time</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
