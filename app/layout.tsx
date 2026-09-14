import './globals.css';
import type {Metadata} from 'next';
import CopyRefresh from '../components/CopyRefresh';
import MaterialFullscreen from '../components/MaterialFullscreen';

export const metadata:Metadata={title:'Академия VOLGA',description:'Обучение и экзамены команды VOLGA'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ru"><body><CopyRefresh/><MaterialFullscreen/>{children}</body></html>
}
