import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetShop - Cuidando do seu melhor amigo",
  description: "O melhor petshop para cuidar do seu pet com amor e carinho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">PetShop</h3>
                  <p className="text-gray-300">
                    Cuidando do seu melhor amigo com amor e carinho.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/produtos" className="hover:text-white">Produtos</a></li>
                    <li><a href="/servicos" className="hover:text-white">Serviços</a></li>
                    <li><a href="/contato" className="hover:text-white">Contato</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contato</h3>
                  <p className="text-gray-300">
                    Email: contato@petshop.com<br />
                    Telefone: (21) 9999-9999
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; 2024 PetShop. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

