'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { User, Globe } from 'lucide-react';
import DomainSettings from '@/shared/DomainSettings';
import ProfileSettings from '@/shared/ProfileSettings';

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <User className="mr-4 text-blue-600" /> Account Settings
      </h1>
      
      <Card className="bg-white shadow-sm">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-t-lg">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger 
              value="domain" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
            >
              <Globe className="mr-2 h-4 w-4" /> Domains
            </TabsTrigger>
          </TabsList>
          
          <div className="p-3">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="domain" className="mt-0">
              <DomainSettings />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}