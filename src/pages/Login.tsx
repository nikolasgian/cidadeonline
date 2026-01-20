import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login - em produção, integrar com Lovable Cloud
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Cidade Online.",
      });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-primary block">Cidade Online</span>
              <span className="text-sm text-muted-foreground">Sistema de Protocolo Digital</span>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar protocolos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-9 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/esqueci-senha" className="text-primary hover:underline">
                  Esqueci minha senha
                </Link>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link to="/cadastro" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao entrar, você concorda com nossos{" "}
          <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link>
          {" "}e{" "}
          <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
        </p>
      </motion.div>
    </div>
  );
}
