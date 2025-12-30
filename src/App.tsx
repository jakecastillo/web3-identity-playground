import React, { useState, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { Toast } from './components/ui/toast'
import { Copy, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react'

function App() {
  const message = useMemo(() => `I visited this site on ${new Date().toLocaleString()}`, [])

  const [address, setAddress] = useState<string>('')
  const [network, setNetwork] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [recoveredAddress, setRecoveredAddress] = useState<string>('')
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<string>('')
  const [toast, setToast] = useState<string>('')
  const [step, setStep] = useState<number>(0) // 0: connect, 1: sign, 2: verify

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No wallet provider found. Please install MetaMask.')
      return
    }
    try {
      setLoading('Connecting...')
      setError('')
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()
      const net = await provider.getNetwork()
      setAddress(addr)
      setNetwork(`${net.name} (${net.chainId})`)
      setStep(1)
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setLoading('')
    }
  }

  const signMessage = async () => {
    try {
      setLoading('Signing...')
      setError('')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const sig = await signer.signMessage(message)
      setSignature(sig)
      setStep(2)
    } catch (err: any) {
      setError(err.message || 'Failed to sign message')
    } finally {
      setLoading('')
    }
  }

  const verifySignature = async () => {
    try {
      setLoading('Verifying...')
      setError('')
      const recovered = ethers.verifyMessage(message, signature)
      setRecoveredAddress(recovered)
      const verified = recovered.toLowerCase() === address.toLowerCase()
      setIsVerified(verified)
    } catch (err: any) {
      setError(err.message || 'Failed to verify signature')
    } finally {
      setLoading('')
    }
  }

  const reset = () => {
    setAddress('')
    setNetwork('')
    setSignature('')
    setRecoveredAddress('')
    setIsVerified(null)
    setError('')
    setStep(0)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast('Copied!')
    } catch {
      setToast('Failed to copy')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Web3 Identity Explainer</h1>
          <p className="text-lg text-gray-600">Learn how wallet addresses and signatures work</p>
        </header>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
              <span className="ml-2">Connect</span>
            </div>
            <div className={`w-8 h-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
              <span className="ml-2">Sign</span>
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
              <span className="ml-2">Verify</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Connect Card */}
          <Card>
            <CardHeader>
              <CardTitle>1. Connect Wallet</CardTitle>
              <CardDescription>Link your wallet to get started</CardDescription>
            </CardHeader>
            <CardContent>
              {!address ? (
                <Button onClick={connectWallet} disabled={loading === 'Connecting...'} className="w-full">
                  {loading === 'Connecting...' ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <div>
                  <Badge variant="secondary" className="mb-2">Connected</Badge>
                  <p className="text-sm font-mono break-all mb-2">{address}</p>
                  <p className="text-sm text-gray-600 mb-2">{network}</p>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(address)}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sign Card */}
          <Card>
            <CardHeader>
              <CardTitle>2. Sign Message</CardTitle>
              <CardDescription>Create a digital signature</CardDescription>
            </CardHeader>
            <CardContent>
              {signature ? (
                <div>
                  <Badge variant="secondary" className="mb-2">Signed</Badge>
                  <p className="text-sm mb-2">Message: {message}</p>
                  <p className="text-sm font-mono break-all mb-2">{signature}</p>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(signature)}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
              ) : (
                <Button onClick={signMessage} disabled={!address || loading === 'Signing...'} className="w-full">
                  {loading === 'Signing...' ? 'Signing...' : 'Sign Message'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Verify Card */}
          <Card>
            <CardHeader>
              <CardTitle>3. Verify Signature</CardTitle>
              <CardDescription>Check the signature's validity</CardDescription>
            </CardHeader>
            <CardContent>
              {isVerified !== null ? (
                <div>
                  <Badge variant={isVerified ? "secondary" : "destructive"} className="mb-2">
                    {isVerified ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
                    {isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                  <p className="text-sm font-mono break-all mb-2">{recoveredAddress}</p>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(recoveredAddress)}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
              ) : (
                <Button onClick={verifySignature} disabled={!signature || loading === 'Verifying...'} className="w-full">
                  {loading === 'Verifying...' ? 'Verifying...' : 'Verify'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accordions */}
        {signature && (
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="signing">
              <AccordionTrigger>What just happened when signing?</AccordionTrigger>
              <AccordionContent>
                <p>You signed the message "{message}" with your private key. This creates a unique signature that proves you control the address without revealing your private key.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {isVerified !== null && (
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="verifying">
              <AccordionTrigger>What just happened when verifying?</AccordionTrigger>
              <AccordionContent>
                <p>The signature was verified using the message and the recovered address. If they match your connected address, the signature is valid.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Security Callout */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Security Notes</h3>
                <ul className="text-sm space-y-1">
                  <li>• Your wallet address is your public identifier.</li>
                  <li>• Signing is free: it does not submit a transaction and costs no gas.</li>
                  <li>• A signature proves control of the private key at the time of signing, not real-world identity.</li>
                  <li>• Never share your seed phrase.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="text-center">
          <Button onClick={reset} variant="outline">Reset</Button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          This is a demonstration app. No data is stored or transmitted.
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <Toast>
          <p>{toast}</p>
        </Toast>
      )}
    </div>
  )
}

export default App
