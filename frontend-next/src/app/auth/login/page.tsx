"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import { createClient } from '@/utils/supabase/browserClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/market-overview')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <LoginIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#f7fafc', fontWeight: 600, mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: '#a0aec0' }}>
          Sign in to your financial dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 2 }}
          slotProps={{
          input: {
            sx: {
            color: 'black',
            backgroundColor: 'white',
            borderRadius: '10px',
            '& fieldset': { borderColor: 'rgba(74, 85, 104, 0.3)' },
            '&:hover fieldset': { borderColor: '#667eea' },
            '&.Mui-focused fieldset': { borderColor: '#667eea' },
            },
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            sx: {
              color: 'black',
              backgroundColor: 'white',
              borderRadius: '10px',
            '& fieldset': { borderColor: 'rgba(74, 85, 104, 0.3)' },
            '&:hover fieldset': { borderColor: '#667eea' },
            '&.Mui-focused fieldset': { borderColor: '#667eea' },
            },
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: '#667eea',
          color: '#ffffff',
          py: 1.5,
          mb: 2,
          fontSize: '1rem',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#5a67d8',
          },
          '&:disabled': {
            backgroundColor: 'rgba(102, 126, 234, 0.3)',
          },
        }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#a0aec0', mb: 1 }}>
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </Typography>
        <Link
          href="/auth/forgot-password"
          style={{
            color: '#a0aec0',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Forgot your password?
        </Link>
      </Box>
    </Box>
  )
}