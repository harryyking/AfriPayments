import {
  Inter,
  Roboto,
  Poppins,
  Playfair_Display,
  Gabarito,
  Montserrat,
  Nunito,
  Bricolage_Grotesque,
  Sacramento,
  Patrick_Hand,
  Open_Sans,
  Lora,
  Merriweather,
  Raleway,
  Dancing_Script,
  Caveat,
  Source_Code_Pro,
  Josefin_Sans,
  Fira_Sans,
  Quicksand,
  Pacifico,
} from 'next/font/google';

// Existing Fonts
const RobotoFont = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const InterFont = Inter({ weight: ['400', '700'], subsets: ['latin'] });
const PoppinsFont = Poppins({ weight: ['400', '700'], subsets: ['latin'] });
const PlayfairFont = Playfair_Display({ weight: ['400', '700'], subsets: ['latin'] });
const GabaritoFont = Gabarito({ weight: ['400', '600', '700'], subsets: ['latin'] });
const MontserratFont = Montserrat({ weight: ['400', '600', '700'], subsets: ['latin'] });
const NunitoFont = Nunito({ weight: ['400', '600', '700'], subsets: ['latin'] });
const BricolageGrotesqueFont = Bricolage_Grotesque({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});
const SacramentoFont = Sacramento({ weight: ['400'], subsets: ['latin'] });
const PatrickHandFont = Patrick_Hand({ weight: ['400'], subsets: ['latin'] });
const OpenSansFont = Open_Sans({ weight: ['300', '400', '600', '700'], subsets: ['latin'] });

// New Interesting Fonts
const LoraFont = Lora({ weight: ['400', '700'], subsets: ['latin'] }); // Elegant serif
const MerriweatherFont = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'] }); // Readable serif
const RalewayFont = Raleway({ weight: ['300', '400', '700'], subsets: ['latin'] }); // Modern sans-serif
const DancingScriptFont = Dancing_Script({ weight: ['400', '700'], subsets: ['latin'] }); // Playful cursive
const CaveatFont = Caveat({ weight: ['400', '700'], subsets: ['latin'] }); // Handwritten vibe
const SourceCodeProFont = Source_Code_Pro({ weight: ['400', '700'], subsets: ['latin'] }); // Monospace for devs
const JosefinSansFont = Josefin_Sans({ weight: ['300', '400', '700'], subsets: ['latin'] }); // Stylish sans-serif
const FiraSansFont = Fira_Sans({ weight: ['400', '600', '700'], subsets: ['latin'] }); // Clean & versatile
const QuicksandFont = Quicksand({ weight: ['400', '700'], subsets: ['latin'] }); // Soft, rounded sans-serif
const PacificoFont = Pacifico({ weight: ['400'], subsets: ['latin'] }); // Fun, casual script

export const fontOptions = [
  { name: 'Inter', value: 'font-inter', fontObject: InterFont, fontFamily: InterFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Roboto', value: 'font-roboto', fontObject: RobotoFont, fontFamily: RobotoFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Poppins', value: 'font-poppins', fontObject: PoppinsFont, fontFamily: PoppinsFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Gabarito', value: 'font-gabarito', fontObject: GabaritoFont, fontFamily: GabaritoFont.style.fontFamily, availableWeights: ['400', '600', '700'] },
  { name: 'Montserrat', value: 'font-montserrat', fontObject: MontserratFont, fontFamily: MontserratFont.style.fontFamily, availableWeights: ['400', '600', '700'] },
  { name: 'Nunito', value: 'font-nunito', fontObject: NunitoFont, fontFamily: NunitoFont.style.fontFamily, availableWeights: ['400', '600', '700'] },
  { name: 'Playfair Display', value: 'font-playfair', fontObject: PlayfairFont, fontFamily: PlayfairFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Bricolage Grotesque', value: 'font-bricolage-grotesque', fontObject: BricolageGrotesqueFont, fontFamily: BricolageGrotesqueFont.style.fontFamily, availableWeights: ['200', '300', '400', '500', '600', '700'] },
  { name: 'Sacramento', value: 'font-sacramento', fontObject: SacramentoFont, fontFamily: SacramentoFont.style.fontFamily, availableWeights: ['400'] },
  { name: 'Patrick Hand', value: 'font-patrick_hand', fontObject: PatrickHandFont, fontFamily: PatrickHandFont.style.fontFamily, availableWeights: ['400'] },
  { name: 'Open Sans', value: 'font-open_sans', fontObject: OpenSansFont, fontFamily: OpenSansFont.style.fontFamily, availableWeights: ['300', '400', '600', '700'] },
  // New Fonts
  { name: 'Lora', value: 'font-lora', fontObject: LoraFont, fontFamily: LoraFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Merriweather', value: 'font-merriweather', fontObject: MerriweatherFont, fontFamily: MerriweatherFont.style.fontFamily, availableWeights: ['300', '400', '700'] },
  { name: 'Raleway', value: 'font-raleway', fontObject: RalewayFont, fontFamily: RalewayFont.style.fontFamily, availableWeights: ['300', '400', '700'] },
  { name: 'Dancing Script', value: 'font-dancing-script', fontObject: DancingScriptFont, fontFamily: DancingScriptFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Caveat', value: 'font-caveat', fontObject: CaveatFont, fontFamily: CaveatFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Source Code Pro', value: 'font-source-code-pro', fontObject: SourceCodeProFont, fontFamily: SourceCodeProFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Josefin Sans', value: 'font-josefin-sans', fontObject: JosefinSansFont, fontFamily: JosefinSansFont.style.fontFamily, availableWeights: ['300', '400', '700'] },
  { name: 'Fira Sans', value: 'font-fira-sans', fontObject: FiraSansFont, fontFamily: FiraSansFont.style.fontFamily, availableWeights: ['400', '600', '700'] },
  { name: 'Quicksand', value: 'font-quicksand', fontObject: QuicksandFont, fontFamily: QuicksandFont.style.fontFamily, availableWeights: ['400', '700'] },
  { name: 'Pacifico', value: 'font-pacifico', fontObject: PacificoFont, fontFamily: PacificoFont.style.fontFamily, availableWeights: ['400'] },
];

export function getFontByValue(value: string) {
  return fontOptions.find((font) => font.value === value);
}