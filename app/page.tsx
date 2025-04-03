import Link from "next/link"
import { ArrowRight, Sparkles, ImageIcon, Type } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Transform Your Images with TextVeil
          </h1>
          <p className="text-xl text-base-content opacity-70 mb-8 max-w-2xl mx-auto">
            Remove backgrounds from your images with AI and add stunning text overlays.
          </p>
          <Link href="/auth">
            <button className="btn btn-primary btn-lg">
              Open App <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Example Images Grid */}
      <section id="examples" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">See TextVeil in Action</h2>
        <p className="text-base-content opacity-70 mb-12 text-center max-w-2xl mx-auto">
          Check out these stunning examples created with TextVeil. Your images could look this good too!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Example 1 */}
          <div className="card shadow-md hover:shadow-lg transition-all">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-content to-secondary-content bg-opacity-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary opacity-30">
                ADVENTURE
              </div>
              <img
                src="https://utfs.io/f/eqXEbyZmWEZ5UbQoPf0F2A1NpwkT3WjOyvhrx4I5qCdbMfJl"
                alt="Person hiking with 'ADVENTURE' text behind them"
                className="relative z-10 h-full object-contain"
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title">Adventure Photography</h3>
              <p className="text-sm text-base-content opacity-70">Background removed with "ADVENTURE" text overlay</p>
            </div>
          </div>

          {/* Example 2 */}
          <div className="card shadow-md hover:shadow-lg transition-all">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary-content to-accent-content bg-opacity-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-secondary opacity-30">
                DREAM BIG
              </div>
              <img
                src="https://utfs.io/f/eqXEbyZmWEZ5mPN1ClMMHKLizxbdTVwuJXa4qoEA6jkflNsP"
                alt="Portrait with 'DREAM BIG' text behind"
                className="relative z-10 h-full object-contain"
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title">Portrait Enhancement</h3>
              <p className="text-sm text-base-content opacity-70">Clean portrait with motivational text behind</p>
            </div>
          </div>

          {/* Example 3 */}
          <div className="card shadow-md hover:shadow-lg transition-all">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-accent-content to-primary-content bg-opacity-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-accent opacity-30">
                FRESH
              </div>
              <img
                src="https://utfs.io/f/eqXEbyZmWEZ5fWW6pNAe3Qwc16gukWImHpG5sSa4Thb2UnzN"
                alt="Food product with 'FRESH' text behind"
                className="relative z-10 h-full object-contain"
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title">Product Photography</h3>
              <p className="text-sm text-base-content opacity-70">Food item with descriptive text background</p>
            </div>
          </div>

          {/* Example 4 */}
          <div className="card shadow-md hover:shadow-lg transition-all">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-success-content to-info-content bg-opacity-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-success opacity-30">
                NATURE
              </div>
              <img
                src="https://utfs.io/f/eqXEbyZmWEZ5p7RziMuOPNH4Bj9Rzd3xMSmrQFk6IgDc7ZCy"
                alt="Plant with 'NATURE' text behind"
                className="relative z-10 h-full object-contain"
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title">Nature Photography</h3>
              <p className="text-sm text-base-content opacity-70">Plant with thematic text integration</p>
            </div>
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-20 text-primary-content mt-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create?</h2>
          <Link href="/auth">
            <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

