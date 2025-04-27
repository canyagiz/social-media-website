import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.tsx'

/* Providers
  Provides a STRUCTURE / FUNCTIONALITY to CHILD COMPONENTS
  In normal React, the data is passed to child by props <Child data={someData} />
  Providers helps to make the structure/functionality GLOBALLY.

  The owner of transferred structure/func -> Provider
  The user -> Consumer
*/

/* QueryClient QueryClientProvider
  QueryClient (Brain): Retrieves, caches, validates the data
    - Caches the fetchs,
    - Stores STATUS (loading , error, success) for every query
    - Cache invalidation: Updating the data and removing the past one
    - Refetch, retry, background update...
    - const client = new QueryClient() The all application going to use the client initialization by provider.

    
  QueryClientProvider (The nerves): The provider which provides the functionality of the Brain throughout the software. 
  <QueryClientProvider client={client}>
        <BrowserRouter> // BrowserRouter listens the URL changes for updating the page. The URL changement is completed by Link tag
        <App />
      </BrowserRouter>

      </QueryClientProvider>

      - The components which are wrapped by the provider can access to the above client by the provider.
      - The useQuery, useMutation and more going to use the client object by the provider.
*/

const client = new QueryClient() 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <BrowserRouter> {/* BrowserRouter listens the URL changes for updating the page. The URL changement is completed by Link tag */}
            <App />
        </BrowserRouter>
      </AuthProvider>
    

    </QueryClientProvider>
    
  </StrictMode>,
)
