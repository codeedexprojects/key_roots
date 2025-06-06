// import { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { AdHeaderList } from '../components/AdHeaderList';
// import { LimitedDealsList } from '../components/LimitedDealsList';
// import { ReferEarnList } from '../components/ReferEarnList';
// import { FooterSectionList } from '../components/FooterSectionList';
// import { ExplorePage } from './ExplorePage';

// export const AdvertisementPage = () => {
//   const [activeTab, setActiveTab] = useState('advertisement');

//   return (
//     <div className='flex-1 overflow-auto'>
//       <h1 className='text-2xl font-semibold mb-6'>Advertisement & Explore</h1>

//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className='w-full'>
//         <TabsList className='mb-6'>
//           <TabsTrigger value='advertisement'>Advertisement</TabsTrigger>
//           <TabsTrigger value='explore'>Explore</TabsTrigger>
//         </TabsList>

//         <TabsContent
//           value='advertisement'
//           className='space-y-10'>

//         </TabsContent>

//         <TabsContent
//           value='explore'
//           className='space-y-6'>
//           <ExplorePage />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };
