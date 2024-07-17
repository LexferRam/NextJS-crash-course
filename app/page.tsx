import Image from 'next/image'
import ProductCard from './components/ProductCard';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>
        Hello
      </h1>
      <Link href="/users">Users</Link>
      <ProductCard />
    </main>
  )
}
