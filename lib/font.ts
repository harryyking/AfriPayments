import { Inter, Roboto, Poppins, Playfair_Display, Gabarito, Montserrat, Nunito, Bricolage_Grotesque, Sacramento, Patrick_Hand, Open_Sans } from 'next/font/google';

const RobotoFont = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const InterFont = Inter({ weight: ['400', '700'], subsets: ['latin'] });
const PoppinsFont = Poppins({ weight: ['400', '700'], subsets: ['latin'] });
const PlayfairFont = Playfair_Display({ weight: ['400', '700'], subsets: ['latin'] });
const GabaritoFont = Gabarito({ weight: ['400', '600', '700'], subsets: ['latin'] });
const MontserratFont = Montserrat({ weight: ['400', '600', '700'], subsets: ['latin'] });
const NunitoFont = Nunito({ weight: ['400', '600', '700'], subsets: ['latin'] });
const BricolageGrotesqueFont = Bricolage_Grotesque({ weight: ["200", "300", "400", "500", "600", "700"], subsets: ["latin"] });
const SacramentoFont = Sacramento({ weight: ["400"], subsets: ['latin'] });
const PatrickHandFont = Patrick_Hand({ weight: ["400"], subsets: ['latin'] });
const OpenSansFont = Open_Sans({ weight: ["300", "400", "600", "700"], subsets: ['latin'] });

export const fontOptions = [
  {
    name: 'Inter',
    value: 'font-inter',
    fontObject: InterFont,
    fontFamily: InterFont.style.fontFamily,
    availableWeights: ['400', '700'],
  },
  {
    name: 'Roboto',
    value: 'font-roboto',
    fontObject: RobotoFont,
    fontFamily: RobotoFont.style.fontFamily,
    availableWeights: ['400', '700'],
  },
  {
    name: 'Poppins',
    value: 'font-poppins',
    fontObject: PoppinsFont,
    fontFamily: PoppinsFont.style.fontFamily,
    availableWeights: ['400', '700'],
  },
  {
    name: 'Gabarito',
    value: 'font-gabarito',
    fontObject: GabaritoFont,
    fontFamily: GabaritoFont.style.fontFamily,
    availableWeights: ['400', '600', '700'],
  },
  {
    name: 'Montserrat',
    value: 'font-montserrat',
    fontObject: MontserratFont,
    fontFamily: MontserratFont.style.fontFamily,
    availableWeights: ['400', '600', '700'],
  },
  {
    name: 'Nunito',
    value: 'font-nunito',
    fontObject: NunitoFont,
    fontFamily: NunitoFont.style.fontFamily,
    availableWeights: ['400', '600', '700'],
  },
  {
    name: 'Playfair Display',
    value: 'font-playfair',
    fontObject: PlayfairFont,
    fontFamily: PlayfairFont.style.fontFamily,
    availableWeights: ['400', '700'],
  },
  {
    name: 'Bricolage Grotesque',
    value: 'font-bricolage-grotesque',
    fontObject: BricolageGrotesqueFont,
    fontFamily: BricolageGrotesqueFont.style.fontFamily,
    availableWeights: ['200', '300', '400', '500', '600', '700'],
  },
  {
    name: 'Sacramento',
    value: 'font-sacramento',
    fontObject: SacramentoFont,
    fontFamily: SacramentoFont.style.fontFamily,
    availableWeights: ['400'],
  },
  {
    name: 'Patrick Hand',
    value: 'font-patrick_hand',
    fontObject: PatrickHandFont,
    fontFamily: PatrickHandFont.style.fontFamily,
    availableWeights: ['400'],
  },
  {
    name: 'Open Sans',
    value: 'font-open_sans',
    fontObject: OpenSansFont,
    fontFamily: OpenSansFont.style.fontFamily,
    availableWeights: ['300', '400', '600', '700'],
  },
];

export function getFontByValue(value: string) {
  return fontOptions.find(font => font.value === value);
}