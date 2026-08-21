import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Task Management System | Technical Assessment',
  description: 'A modern Task Management application designed for Full Stack Developer technical assessment.',
};

// Anti-FOUC (Flash of Unstyled Content) script injected into head
const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme_mode');
      var savedAccent = localStorage.getItem('accent_color');
      
      var theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var accent = savedAccent || 'blue';
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      document.documentElement.setAttribute('data-accent', accent);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased selection:bg-accent/20">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
