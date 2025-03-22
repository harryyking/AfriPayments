import { Inter, Roboto, Poppins, Playfair_Display, Gabarito, Montserrat, Nunito, Bricolage_Grotesque, Sacramento, Patrick_Hand, Open_Sans } from 'next/font/google'


const RobotoFont = Roboto({ weight: ['400', '700'], subsets: ['latin'] })
const InterFont = Inter({ weight: ['400', '700'], subsets: ['latin'] })
const PoppinsFont = Poppins({ weight: ['400', '700'], subsets: ['latin'] })
const PlayfairFont = Playfair_Display({ subsets: ['latin'] })
const GabaritoFont = Gabarito({ weight: ['400','600', '700'], subsets: ['latin'] })
const MontserratFont = Montserrat({ weight: ['400','600', '700'], subsets: ['latin'] })
const NunitoFont = Nunito({ weight: ['400','600', '700'], subsets: ['latin'] })
const BricolageGrotesqueFont = Bricolage_Grotesque({weight: ["200", "300", "400", "500", "600", "700"], subsets: ["latin"]})
const SacramentoFont = Sacramento({weight: ["400"], subsets: ['latin']})
const PatrickHandFont = Patrick_Hand({weight:["400"], subsets: ['latin']})
const OpenSansFont = Open_Sans({weight: ["300", "400", "600", "700"], subsets: ['latin']})

export const fontOptions = [
  {
    name: 'Inter',
    value: 'font-inter',
    fontObject: InterFont
  },
  {
    name: 'Roboto',
    value: 'font-roboto',
    fontObject: RobotoFont
  },
  {
    name: 'Poppins',
    value: 'font-poppins',
    fontObject: PoppinsFont
  },
  {
    name: 'Gabarito',
    value: 'font-gabarito',
    fontObject: GabaritoFont
  },
  {
    name: 'Montserrat',
    value: 'font-montserrat',
    fontObject: MontserratFont
  },
  {
    name: 'Nunito',
    value: 'font-nunito',
    fontObject: NunitoFont
  },
  {
    name: 'Playfair Display',
    value: 'font-playfair',
    fontObject: PlayfairFont
  },
  {
    name: 'Bricolage Grotesque',
    value: 'font-bricolage-grotesque',
    fontObject: BricolageGrotesqueFont
  },
  {
    name: 'Sacramento',
    value: 'font-sacramento',
    fontObject: SacramentoFont
  },
  {
    name: 'Patrick Hand',
    value: 'font-patrick_hand',
    fontObject: PatrickHandFont
  },
  {
    name: 'Open Sans',
    value: 'font-open_sans',
    fontObject: OpenSansFont
  },
]

export function getFontByValue(value: string) {
  return fontOptions.find(font => font.value === value)
}

