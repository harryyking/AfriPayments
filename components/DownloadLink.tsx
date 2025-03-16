interface DownloadLinkProps {
    url: string;
  }
  
  export default function DownloadLink({ url }: DownloadLinkProps) {
    return (
      <a
        href={url}
        download="podcast.mp3"
        className="block text-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Download Your Podcast
      </a>
    );
  }