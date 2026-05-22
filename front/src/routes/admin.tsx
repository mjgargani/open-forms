import { createFileRoute, redirect } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Trash2, Edit2, ShieldAlert } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw redirect({ to: '/login' });
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'ADMIN') {
      throw redirect({ to: '/' });
    }
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    user: '',
    email: '',
    name: '',
    password: '',
    role: 'USER'
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newUser: any) => {
      return api.post('/users', newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return api.patch(`/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const dataToUpdate: any = { ...formData };
      if (!dataToUpdate.password) delete dataToUpdate.password;
      updateMutation.mutate({ id: isEditing, data: dataToUpdate });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (user: any) => {
    setIsEditing(user.id);
    setFormData({
      user: user.user,
      email: user.email,
      name: user.name,
      password: '',
      role: user.role
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ user: '', email: '', name: '', password: '', role: 'USER' });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Carregando usuários...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuário (Login)</label>
              <input type="text" required value={formData.user} onChange={(e) => setFormData({...formData, user: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha {isEditing && '(deixe em branco para manter)'}</label>
              <input type="password" required={!isEditing} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded bg-white">
                <option value="USER">Usuário (USER)</option>
                <option value="ADMIN">Administrador (ADMIN)</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90">
                {isEditing ? 'Salvar' : 'Criar'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="px-4 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Usuários Cadastrados</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Nome</th>
                  <th className="p-4 font-medium text-gray-600">Usuário</th>
                  <th className="p-4 font-medium text-gray-600">Role</th>
                  <th className="p-4 font-medium text-gray-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">{user.user}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(user)} className="text-gray-400 hover:text-primary p-2">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(window.confirm('Excluir usuário?')) deleteMutation.mutate(user.id) }} className="text-gray-400 hover:text-red-500 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
