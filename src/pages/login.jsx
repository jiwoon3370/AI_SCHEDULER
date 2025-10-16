import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 로그인 함수
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setError(error.message)
    else {
      localStorage.setItem('ai_scheduler_user', JSON.stringify(data.user))
      navigate('/dashboard')
    }
  }

  // 회원가입 함수
  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) setError(error.message)
    else {
      alert('✅ 회원가입 성공! 이메일 인증을 완료해주세요.')
      setIsSignup(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignup ? '회원가입' : '로그인'}
        </h1>

        <form
          onSubmit={isSignup ? handleSignup : handleLogin}
          className="flex flex-col gap-4"
        >
          {/* 이메일 */}
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* 비밀번호 */}
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isSignup ? '회원가입' : '로그인'}
          </button>
        </form>

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        {/* 로그인/회원가입 전환 */}
        <p className="text-center text-sm text-gray-600 mt-5">
          {isSignup ? '이미 계정이 있나요?' : '계정이 없나요?'}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? '로그인' : '회원가입'}
          </button>
        </p>
      </div>
    </div>
  )
}
