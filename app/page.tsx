import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

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

