"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { TextValidation } from '@/components/text-validation'
import { ImageValidation } from '@/components/image-validation'
import { FileText, Image } from 'lucide-react'
import { ApiKeys } from '@/app/dashboard/page'
import { motion } from 'framer-motion'

interface ValidationTabsProps {
  apiKeys: ApiKeys
}

export function ValidationTabs({ apiKeys }: ValidationTabsProps) {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <Card className="w-full">
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="text" 
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="h-4 w-4" />
              Text Validation
            </TabsTrigger>
            <TabsTrigger 
              value="image" 
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Image className="h-4 w-4" />
              Image Validation
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="text" className="mt-0">
              <TextValidation apiKeys={apiKeys} />
            </TabsContent>
            
            <TabsContent value="image" className="mt-0">
              <ImageValidation apiKeys={apiKeys} />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </Card>
  )
}