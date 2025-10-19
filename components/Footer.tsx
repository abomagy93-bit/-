import React from 'react';

interface FooterProps {
  visitorCount: number;
  isPlaying: boolean;
  togglePlay: () => void;
}

const Footer: React.FC<FooterProps> = ({ visitorCount, isPlaying, togglePlay }) => {
  return (
    <footer className="text-center py-4 text-gray-400 flex flex-col items-center gap-4">
      <div>
        <p className="text-sm sm:text-base">
          عدد الزائرين: <span className="font-bold text-cyan-400">{visitorCount}</span>
        </p>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-4">
        <button
          onClick={togglePlay}
          className="bg-teal-600 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300"
          aria-label={isPlaying ? 'إيقاف الإذاعة' : 'تشغيل الإذاعة'}
        >
          {isPlaying ? 'إيقاف إذاعة القرآن الكريم' : 'تشغيل إذاعة القرآن الكريم'}
        </button>
        <a
          href="https://quran-elkareem.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sky-600 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-300 inline-block text-center"
        >
          فتح موقع القرآن الكريم
        </a>
      </div>
      
      <p className="text-xs sm:text-sm">تم بواسطة كريم عشماوي</p>
    </footer>
  );
};

export default Footer;