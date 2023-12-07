import { ArrowPathIcon, ServerStackIcon, LockClosedIcon, ChartBarIcon, BanknotesIcon } from '@heroicons/react/20/solid'


const features = [
  {
    name: '~3.5% Staking fees',
    description:
      'Coming from Lido ETH, Rocket Pool ETH and Stacked Frax ETH. They each represent ~33% of the pool.',
    href: '#',
    icon: ServerStackIcon,
  },
  {
    name: '~0.5% Trading fees',
    description:
      'By Providing liquidity to the pool, you will earn an extra 0.5%, thanks to Curve AMM trading fees, with no Impermanent Loss.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: '~4% $CRV rewards',
    description:
      'The pool is also eligible for $CRV rewards, which are distributed to liquidity providers.',
    href: '#',
    icon: BanknotesIcon,
  },
]

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
            Announcing our next round of funding.{' '}
            <a href="#" className="font-semibold text-white">
              <span className="absolute inset-0" aria-hidden="true" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Maximize your $ETH yields
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            YieldNest TryLSD pool allows you to generate up to 8% APY on your
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Get started
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Cutting edge</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Next generation yield farming
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We made a Trading pool which holds Lido ETH, Rocket Pool ETH and Stacked Frax ETH, using Curve AMM technology.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-28">
        <div className="text-center">
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Go to Deposit Page
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
