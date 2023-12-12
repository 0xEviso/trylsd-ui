const vaults = [
  {
    name: 'Curve Staking',
    difficulty: 'Easy',
    risk: 'Low',
    reward: 'Low',
    autocomp: 'No',
    link: 'https://curve.fi/#/ethereum/pools/factory-tricrypto-14/deposit'
  },
  {
    name: 'Convex',
    difficulty: 'Medium',
    risk: 'Medium',
    reward: 'Medium',
    autocomp: 'No',
    link: 'https://www.convexfinance.com/stake/ethereum/251'
  },
  {
    name: 'Concentrator',
    difficulty: 'Hard',
    risk: 'Medium',
    reward: 'High',
    autocomp: 'Yes',
    link: 'https://concentrator.aladdin.club/vaults/'
  },
  {
    name: 'Beefy',
    difficulty: 'Easy',
    risk: 'Medium',
    reward: 'High',
    autocomp: 'Yes',
    link: 'https://app.beefy.com/vault/convex-trylsd'
  },
]

export default function StakingList() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-900 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                          Difficulty
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                          Auto-compound
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                          Risk
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                          Reward
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Link</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {vaults.map((vault) => (
                        <tr key={vault.name}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                            {vault.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{vault.difficulty}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{vault.autocomp}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{vault.risk}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{vault.reward}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <a href={vault.link} target="_blank" className="text-indigo-400 hover:text-indigo-300">
                              Visit<span className="sr-only">, {vault.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
