import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../components/Button';
import Input from '../components/Input';
import { loginUser, registerUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[a-z]/, 'Include a lowercase letter')
    .regex(/\d/, 'Include a number')
});

export default function LoginRegister() {
  const [mode, setMode] = useState('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const schema = mode === 'login' ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const action = mode === 'login' ? loginUser(values) : registerUser(values);
    const result = await dispatch(action);

    if (loginUser.fulfilled.match(result) || registerUser.fulfilled.match(result)) {
      dispatch(
        showToast({
          title: mode === 'login' ? 'Welcome back' : 'Account ready',
          message: 'You are now signed in.',
          type: 'success'
        })
      );
      navigate('/');
    } else {
      dispatch(
        showToast({
          title: 'Authentication error',
          message: result.payload || 'Please verify your credentials',
          type: 'danger'
        })
      );
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="glass-panel w-full max-w-md space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </h1>
          <p className="text-sm text-white/60">
            Access the full E-Commerce Store Pro experience with authentication, orders, and admin
            workflows.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Email" type="email" {...register('email')} helperText={errors.email?.message} />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            helperText={errors.password?.message}
          />
          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-xs text-white/50">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <button
            type="button"
            className="text-neon focus-ring"
            onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login' ? 'Register here' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
}
