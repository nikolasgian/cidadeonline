import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function AlterarSenha() {
  const [formData, setFormData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
    setSuccess(false);
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.senhaAtual) {
      newErrors.push("Senha atual é obrigatória");
    }

    if (!formData.novaSenha) {
      newErrors.push("Nova senha é obrigatória");
    } else if (formData.novaSenha.length < 8) {
      newErrors.push("Nova senha deve ter pelo menos 8 caracteres");
    }

    if (!formData.confirmarSenha) {
      newErrors.push("Confirmação da senha é obrigatória");
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.push("Nova senha e confirmação não coincidem");
    }

    if (formData.senhaAtual === formData.novaSenha) {
      newErrors.push("Nova senha deve ser diferente da senha atual");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simular API call
      setTimeout(() => {
        setSuccess(true);
        setFormData({
          senhaAtual: "",
          novaSenha: "",
          confirmarSenha: "",
        });
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Alterar Senha</h1>
            <p className="text-muted-foreground mt-2">
              Mantenha sua conta segura com uma senha forte
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Alteração de Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Senha Atual */}
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="senhaAtual"
                      type={showPasswords.senhaAtual ? "text" : "password"}
                      value={formData.senhaAtual}
                      onChange={(e) => handleInputChange("senhaAtual", e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("senhaAtual")}
                    >
                      {showPasswords.senhaAtual ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Nova Senha */}
                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="novaSenha"
                      type={showPasswords.novaSenha ? "text" : "password"}
                      value={formData.novaSenha}
                      onChange={(e) => handleInputChange("novaSenha", e.target.value)}
                      placeholder="Digite sua nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("novaSenha")}
                    >
                      {showPasswords.novaSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres
                  </p>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showPasswords.confirmarSenha ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                      placeholder="Confirme sua nova senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirmarSenha")}
                    >
                      {showPasswords.confirmarSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Erros */}
                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Sucesso */}
                {success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Senha alterada com sucesso!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botão */}
                <Button type="submit" className="w-full">
                  Alterar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}