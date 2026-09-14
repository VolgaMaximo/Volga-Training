import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'VOLGA Training',description:'Staff training and examination'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
