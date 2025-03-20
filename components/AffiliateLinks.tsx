export default function AffiliateLinks() {
    return (
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Recommended Tools</h3>
        <ul className="space-y-2">
          <li>
            <a 
              href="https://todoist.com?aff=xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Todoist - Organize your tasks
            </a>
            <p className="text-sm text-gray-600">The best task manager for staying organized and productive. ($5-$20/sale)</p>
          </li>
          
          <li>
            <a 
              href="https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/1847941834/ref=sr_1_1?&linkCode=ll1&tag=remotetools-20"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Atomic Habits - Build better routines
            </a>
            <p className="text-sm text-gray-600">Build better habits to improve your productivity. Essential reading for remote workers. (4% commission)</p>
          </li>
          
          <li>
            <a 
              href="https://www.amazon.com/Sony-WH-1000XM5-Canceling-Wireless-Headphones/dp/B09XS7JWHH/ref=sr_1_3?&linkCode=ll1&tag=remotetools-20"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Noise-Canceling Headphones
            </a>
            <p className="text-sm text-gray-600">Block out distractions and focus on your work with premium noise-canceling headphones. (4-8% commission)</p>
          </li>
        </ul>
      </div>
    );
  }