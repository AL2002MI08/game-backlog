import { Anchor, Button, Checkbox, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { AlertCircle } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import bgSvg from '@/assets/images/bg-image.svg';
import { Input } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { RouteLinks } from '@/constants/routes';
import { loginSchema, LoginFormValues } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  if (isLoading || isSubmitting) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={RouteLinks.GameOverview} replace />;
  }

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login(data);
      navigate(RouteLinks.GameOverview);
    } catch (e) {
      setError('root', {
        message: e instanceof Error ? e.message : 'Invalid credentials. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgSvg})` }}>
      <Paper
        radius={0}
        className="min-h-screen w-full md:w-1/2 lg:w-auto lg:max-w-125 p-8 sm:p-12 rounded-none! border-r dark:border-slate-800 flex flex-col justify-center"
      >
        <div className="w-full max-w-sm mx-auto">
          <Title order={2} className="text-2xl sm:text-3xl font-inter font-normal text-center mb-2 p-10">
            Welcome back to Game Backlog!
          </Title>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {errors.root?.message && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-950/60 border border-red-800/50 text-red-300 text-sm">
                <AlertCircle size={14} className="shrink-0 text-red-400" />
                <span>{errors.root.message}</span>
              </div>
            )}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="md"
              radius="md"
              error={errors.password?.message}
              disabled={isSubmitting}
              {...register('password')}
            />

            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.checked)}
                  onBlur={field.onBlur}
                  label="Keep me logged in"
                  size="sm"
                  className="mt-1"
                  disabled={isSubmitting}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              radius="md"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="mt-2 text-teal-600 font-semibold"
            >
              Login
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}