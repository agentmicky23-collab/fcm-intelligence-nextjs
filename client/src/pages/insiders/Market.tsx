import { InsidersSidebar } from "./InsidersHome";

export default function InsiderMarket() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar active="/insiders/market" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Market Intelligence</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="fcm-card">
            <div className="text-sm text-muted-foreground mb-2">Avg PO Branch Fees (Mains)</div>
            <div className="font-financial text-3xl mb-1">£68,400</div>
            <div className="text-green-500 text-xs font-bold">↑ 2.4% vs last quarter</div>
          </div>
          <div className="fcm-card">
            <div className="text-sm text-muted-foreground mb-2">Crown Conversions Available</div>
            <div className="font-financial text-3xl mb-1">14</div>
            <div className="text-gold text-xs font-bold">Active pipeline across England</div>
          </div>
          <div className="fcm-card">
            <div className="text-sm text-muted-foreground mb-2">Forecourt Market Outlook</div>
            <div className="font-financial text-3xl mb-1">Strong</div>
            <div className="text-green-500 text-xs font-bold">Independent margins holding</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Regional Breakdown</h2>
        <div className="fcm-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Region</th>
                <th className="pb-3 font-medium">Avg Fees (PO)</th>
                <th className="pb-3 font-medium">Active Listings</th>
                <th className="pb-3 font-medium">Avg Asking Price</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 font-medium">West Midlands</td>
                <td className="py-3 font-financial">£72,500</td>
                <td className="py-3 font-financial text-white">8</td>
                <td className="py-3 font-financial text-white">£155,000</td>
                <td className="py-3 text-green-500 text-xs font-bold">↑ Heating</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Yorkshire</td>
                <td className="py-3 font-financial">£58,200</td>
                <td className="py-3 font-financial text-white">5</td>
                <td className="py-3 font-financial text-white">£120,000</td>
                <td className="py-3 text-yellow-500 text-xs font-bold">→ Stable</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">East Midlands</td>
                <td className="py-3 font-financial">£55,800</td>
                <td className="py-3 font-financial text-white">4</td>
                <td className="py-3 font-financial text-white">£130,000</td>
                <td className="py-3 text-green-500 text-xs font-bold">↑ Growing</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">South West</td>
                <td className="py-3 font-financial">£48,000</td>
                <td className="py-3 font-financial text-white">3</td>
                <td className="py-3 font-financial text-white">£95,000</td>
                <td className="py-3 text-yellow-500 text-xs font-bold">→ Stable</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">London & SE</td>
                <td className="py-3 font-financial">£92,000</td>
                <td className="py-3 font-financial text-white">6</td>
                <td className="py-3 font-financial text-white">£250,000</td>
                <td className="py-3 text-red-500 text-xs font-bold">↓ Cooling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
