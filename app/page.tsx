import Link from "next/link"
import { ArrowRight, Sparkles, Coffee } from "lucide-react"

// Image data array - easy to add more images
const exampleImages = [
  {
    id: 1,
    src: "https://utfs.io/f/eqXEbyZmWEZ5UbQoPf0F2A1NpwkT3WjOyvhrx4I5qCdbMfJl",
    alt: "Image with text overlay",
    text: "ADVENTURE",
    gradientFrom: "primary-content",
    gradientTo: "secondary-content",
    textColor: "primary",
  },
  {
    id: 2,
    src: "https://utfs.io/f/eqXEbyZmWEZ5mPN1ClMMHKLizxbdTVwuJXa4qoEA6jkflNsP",
    alt: "Image with text overlay",
    text: "DREAM BIG",
    gradientFrom: "secondary-content",
    gradientTo: "accent-content",
    textColor: "secondary",
  },
  {
    id: 3,
    src: "https://utfs.io/f/eqXEbyZmWEZ5fWW6pNAe3Qwc16gukWImHpG5sSa4Thb2UnzN",
    alt: "Image with text overlay",
    text: "FRESH",
    gradientFrom: "accent-content",
    gradientTo: "primary-content",
    textColor: "accent",
  },
  {
    id: 4,
    src: "https://utfs.io/f/eqXEbyZmWEZ5p7RziMuOPNH4Bj9Rzd3xMSmrQFk6IgDc7ZCy",
    alt: "Image with text overlay",
    text: "NATURE",
    gradientFrom: "success-content",
    gradientTo: "info-content",
    textColor: "success",
  },
  // Add more images here by following the same pattern
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Add beautiful texts behind images with Textveil
          </h1>
          
          <Link href="/auth">
            <button className="btn btn-outline rounded btn-lg">
              Open App
            </button>
          </Link>
        </div>
      </section>

      {/* Example Images Grid */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {exampleImages.map((image) => (
            <div key={image.id} className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div
                className={`relative bg-gradient-to-br from-${image.gradientFrom} to-${image.gradientTo} bg-opacity-10 flex items-center justify-center`}
              >
                <div
                  className={`absolute inset-0 flex items-center justify-center text-5xl font-bold text-${image.textColor} opacity-30`}
                >
                  {image.text}
                </div>
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="relative z-10 w-full h-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>

         {/* Enhanced CTA Section with animations */}
         <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-20 text-primary-content mt-auto relative overflow-hidden group">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 transition-transform duration-500 ease-out group-hover:scale-105">
            Ready to Transform Your Images?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 transition-all duration-500 ease-out group-hover:opacity-100">
            Join thousands of creators who are already using TextVeil to create stunning visuals.
          </p>
          <Link href="/auth">
            <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg group">
              <span className="relative z-10 flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* Buy Me a Coffee Footer */}
      <footer className="py-6 bg-base-200">
        <div className="container mx-auto px-4 flex justify-center">
          <a
            href="https://www.buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 text-base-content hover:bg-amber-100 hover:text-amber-800 transition-all duration-300 hover:shadow-md group"
          >
            <Coffee className="h-5 w-5 text-amber-600 group-hover:animate-wiggle" />
            <span className="font-medium">Buy me a coffee</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

