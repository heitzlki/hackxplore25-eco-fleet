'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function ApiDemo() {
  const [exampleData, setExampleData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  // Fetch example data
  const fetchExampleData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/example');
      const data = await res.json();
      setExampleData(data);
      toast('Example data fetched successfully');
    } catch (error) {
      toast('Failed to fetch example data', {
        description: 'An error occurred while fetching data',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      toast('Users fetched successfully');
    } catch (error) {
      toast('Failed to fetch users', {
        description: 'An error occurred while fetching users',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to create user');
      }

      const newUser = await res.json();

      // Update users list
      setUsers([...users, newUser]);

      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'user',
      });

      toast('User created successfully');
    } catch (error) {
      toast('Failed to create user', {
        description: 'Please make sure all fields are filled correctly',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove deleted user from state
      setUsers(users.filter((user) => user.id !== id));

      toast('User deleted successfully');
    } catch (error) {
      toast('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load users on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-8'>API Endpoints Demo</h1>

      <Tabs defaultValue='users'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='users'>Users API</TabsTrigger>
          <TabsTrigger value='example'>Example API</TabsTrigger>
        </TabsList>

        <TabsContent value='users' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Create User</CardTitle>
                <CardDescription>Add a new user to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUser} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='role'>Role</Label>
                    <Input
                      id='role'
                      name='role'
                      value={formData.role}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type='submit' disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users List</CardTitle>
                <CardDescription>
                  List of all users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <div key={user.id} className='border p-4 rounded-md'>
                        <div className='font-medium'>{user.name}</div>
                        <div className='text-sm text-gray-500'>
                          {user.email}
                        </div>
                        <div className='text-xs bg-slate-100 dark:bg-slate-800 inline-block px-2 py-1 rounded mt-1'>
                          {user.role}
                        </div>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => deleteUser(user.id)}
                          className='mt-2'>
                          Delete
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-4'>No users found</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={fetchUsers}
                  disabled={loading}
                  variant='outline'>
                  {loading ? 'Refreshing...' : 'Refresh Users'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='example' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Example API Response</CardTitle>
              <CardDescription>
                Data from the example API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exampleData ? (
                <pre className='bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto'>
                  {JSON.stringify(exampleData, null, 2)}
                </pre>
              ) : (
                <div className='text-center py-8'>
                  Click the button below to fetch data
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={fetchExampleData} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Example Data'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
