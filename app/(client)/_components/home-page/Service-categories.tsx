'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle } from 'lucide-react';

const allServices = [
  {
    id: 's1',
    title: 'Web Development',
    icon: '/icons/web.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's2',
    title: 'Graphic Design',
    icon: '/icons/graphic.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's3',
    title: 'SEO & Content Writing',
    icon: '/icons/seo.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's4',
    title: 'Photography & Video Editing',
    icon: '/icons/seo.png',
    category: 'Events & Entertainment',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's5',
    title: 'IT Support & Tech Help',
    icon: '/icons/it.png',
    category: 'Education & Learning',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's6',
    title: 'Legal Advice',
    icon: '/icons/legal.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's7',
    title: 'Accounting & Tax Help',
    icon: '/icons/seo.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
  {
    id: 's8',
    title: 'Content Strategy Consulting',
    icon: '/icons/marketing.png',
    category: 'Professional & Business Services',
    user: {
      name: 'Katie Sims',
      email: 'katie_sims@gmail.com',
      avatar: '/avatars/katie.png',
      requestSkill: 'Marketing & Social Media Management',
    },
  },
];

const suggestedUsers = [
  {
    id: 'u1',
    name: 'David Elson',
    email: 'david@example.com',
    rating: 4.7,
    avatar: '/avatars/david.png',
  },
  {
    id: 'u2',
    name: 'Eddie Lake',
    email: 'eddie@example.com',
    rating: 4.2,
    avatar: '/avatars/eddie.png',
  },
  {
    id: 'u3',
    name: 'Jerry Helfer',
    email: 'jerry@example.com',
    rating: 4.4,
    avatar: '/avatars/jerry.png',
  },
  {
    id: 'u4',
    name: 'Iva Ryan',
    email: 'iva@example.com',
    rating: 4.7,
    avatar: '/avatars/iva.png',
  },
];

export default function ServiceExchangeFlow() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [modalStep, setModalStep] = useState<'none' | 'exchange' | 'users' | 'success'>('none');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('Web Development');

  const handleExchangeClick = (service: any) => {
    setSelectedService(service);
    setModalStep('exchange');
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <>
      {/* Service Cards */}
      <section className="bg-white text-[#4A4C56] px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">Service Categories</h2>
        <div className="grid grid-cols-1 text-center sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allServices.map(service => (
            <div key={service.id} className="border border-[#20B894] rounded-2xl p-6 text-center hover:bg-[#F1FCF9] hover:text-[#070707] transition">
              <Image src={service.icon} alt={service.title} width={48} height={48} className="mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-4">{service.title}</h3>
              <div className=" flex justify-center items-center">
                <button
                  onClick={() => handleExchangeClick(service)}
                  className="flex items-center justify-center gap-2 text-sm border border-[#20B894] text-[#20B894] px-4 py-2 rounded-full hover:bg-[#20B894]/10 transition"
                >
                  Exchange Service <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Modal Overlay */}
      {modalStep !== 'none' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full p-10 max-w-[70%] relative">
            <button
              className="absolute top-4 right-4 text-[#20B894] text-xl"
              onClick={() => {
                setModalStep('none');
                setSelectedUsers([]);
              }}
            >
              ✕
            </button>

            {modalStep === 'exchange' && selectedService && (
              <div className='space-y-10'>

                <div className=" flex justify-between items-center">
                  <div className="flex items-center  gap-4 ">
                    <Image src={selectedService.user.avatar} alt="avatar" width={48} height={48} className="rounded-full" />
                    <div>
                      <h3 className="font-semibold text-[#070707]">{selectedService.user.name}</h3>
                      <p className="text-sm text-gray-500">{selectedService.user.email}</p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 gap-4">
                    <button
                      onClick={() => setModalStep('users')}
                      className="border border-[#B49378] text-[#4A4C56] px-4 py-2 rounded-full"
                    >
                      Select Specific Users
                    </button>
                    <button
                      onClick={() => setModalStep('success')}
                      className="bg-[#20B894] text-white px-6 py-2 rounded-full flex items-center gap-2"
                    >
                      Request Exchange Service <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="bg-[#F5F5F5] p-4 rounded w-full">
                    <p className="text-sm text-gray-400 mb-1">Request skill:</p>
                    <p className="font-medium">{selectedService.user.requestSkill}</p>
                  </div>
                  {/* Swap Icon */}
                  <div className="flex items-center justify-center my-4 sm:my-0">
                    <Image
                      src="/swapicon.png"
                      alt="Swap Icon"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className="bg-[#F5F5F5] p-4 rounded w-full">
                    <p className="text-sm text-gray-400 mb-1">My skill:</p>
                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 text-sm"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Coding">Coding</option>
                    </select>
                  </div>
                </div>



              </div>
            )}

            {modalStep === 'users' && (
              <>
                <h3 className="text-lg font-semibold mb-4">Select Specific Users</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                  {suggestedUsers.map(user => (
                    <div
                      key={user.id}
                      className={`flex justify-between items-center p-3 border rounded-xl ${selectedUsers.includes(user.id) ? 'border-[#20B894]' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
                        <div>
                          <p className="font-medium text-[#070707]">{user.name} <span className="text-yellow-500 ml-1">★ {user.rating}</span></p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalStep('success')}
                    className="bg-[#20B894] text-white px-6 py-2 rounded-full"
                  >
                    Send Request
                  </button>
                  <button
                    onClick={() => setModalStep('none')}
                    className="border border-red-500 text-red-500 px-6 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modalStep === 'success' && (
              <div className="text-center py-10">
                <CheckCircle className="w-12 h-12 mx-auto text-[#20B894] mb-4" />
                <h2 className="text-xl font-semibold text-[#070707] mb-2">Exchange request is sent!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Wait for the user to review your exchange request. After they have reviewed your request they will get connected to you through chat. All the best!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="">
        <div className="text-center">
          <button className="bg-[#20B894] text-white text-sm font-medium px-6 py-3 rounded-full flex items-center gap-2 mx-auto hover:opacity-90 transition">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </>
  );
}
