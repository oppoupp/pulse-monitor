import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Pulse — мониторинг сайтов',description:'Доступность, время ответа и история событий в одном месте.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ru"><body>{children}</body></html>}
