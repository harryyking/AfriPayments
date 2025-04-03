import Link from "next/link"
import { ArrowRight, Sparkles, ImageIcon, Type } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">TextVeil</span>
        </div>
        <Link href="/auth">
          <button className="btn btn-ghost">Sign In</button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Transform Your Images with TextVeil
          </h1>
          <p className="text-xl text-base-content opacity-70 mb-8 max-w-2xl mx-auto">
            Effortlessly remove backgrounds and create stunning text overlays with our AI-powered tool. Perfect for
            designers, marketers, and content creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <button className="btn btn-primary btn-lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <Link href="#examples">
              <button className="btn btn-outline btn-lg">See Examples</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center">
                <div className="h-12 w-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="card-title">Background Removal</h3>
                <p className="text-base-content opacity-70">
                  Remove backgrounds from any image with just one click using our advanced AI.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center">
                <div className="h-12 w-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Type className="h-6 w-6 text-primary" />
                </div>
                <h3 className="card-title">Text Overlays</h3>
                <p className="text-base-content opacity-70">
                  Add beautiful text that appears behind your subject for a stunning 3D effect.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body items-center text-center">
                <div className="h-12 w-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="card-title">One-Click Export</h3>
                <p className="text-base-content opacity-70">
                  Download your creations in high resolution for social media, marketing, or print.
                </p>
              </div>
            </div>
          </div>
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

      {/* How It Works */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How TextVeil Works</h2>
          <p className="text-base-content opacity-70 mb-12 text-center max-w-2xl mx-auto">
            Our simple three-step process makes creating stunning images effortless
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4 text-primary-content font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Upload Your Image</h3>
              <p className="text-base-content opacity-70">Upload any image you want to enhance with TextVeil.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4 text-primary-content font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Add Your Text</h3>
              <p className="text-base-content opacity-70">Choose your text, font, and positioning options.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4 text-primary-content font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Download & Share</h3>
              <p className="text-base-content opacity-70">
                Export your creation in high resolution and share it with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-24 text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Images?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators who are already using TextVeil to create stunning visuals that stand out.
          </p>
          <Link href="/auth">
            <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200">
              Start Creating for Free <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
          <p className="mt-4 text-sm opacity-80">No credit card required. Free plan includes 5 images per month.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary-content" />
            <span className="font-bold">TextVeil</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="link link-hover">
              Privacy
            </Link>
            <Link href="/terms" className="link link-hover">
              Terms
            </Link>
            <Link href="/contact" className="link link-hover">
              Contact
            </Link>
          </div>
          <div className="mt-4 text-sm">© {new Date().getFullYear()} TextVeil. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

