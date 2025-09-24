"use client";

import React, { useState } from "react";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  ChevronRight,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Senior Software Engineer at TechCorp. Passionate about building scalable web applications and exploring new technologies.",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  interface FormData {
    name: string;
    email: string;
    bio: string;
    avatar: string;
  }

  interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const tabContentVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const tabs = [
    { id: "account", label: "Account", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
  ];

  const ToggleSwitch = ({ isOn, onToggle }: ToggleSwitchProps) => (
    <motion.button
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        isOn ? "bg-blue-600" : "bg-gray-200"
      }`}
      onClick={onToggle}
      animate={{ backgroundColor: isOn ? "#2563eb" : "#e5e7eb" }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="inline-block h-4 w-4 transform rounded-full bg-white"
        animate={{
          x: isOn ? 20 : 4,
          transition: { type: "spring", stiffness: 700, damping: 30 },
        }}
      />
    </motion.button>
  );

  return (
    <div className="wrapper py-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-64 border-r border-gray-200"
          >
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight size={18} className="ml-auto text-blue-500" />
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          <div className="flex-1 p-6">
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <Image
                        width={96}
                        height={96}
                        src={formData.avatar}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-semibold">{formData.name}</h2>
                      <p className="text-gray-500">{formData.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </motion.button>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive updates, alerts and offers
                        </p>
                      </div>
                      <ToggleSwitch
                        isOn={emailNotifications}
                        onToggle={() =>
                          setEmailNotifications(!emailNotifications)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications on your device
                        </p>
                      </div>
                      <ToggleSwitch
                        isOn={pushNotifications}
                        onToggle={() =>
                          setPushNotifications(!pushNotifications)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium">Weekly Newsletter</h3>
                        <p className="text-sm text-gray-500">
                          Get weekly updates on new features
                        </p>
                      </div>
                      <ToggleSwitch isOn={false} onToggle={() => {}} />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium">Product Updates</h3>
                        <p className="text-sm text-gray-500">
                          Get notified about new product releases
                        </p>
                      </div>
                      <ToggleSwitch isOn={true} onToggle={() => {}} />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <ToggleSwitch
                        isOn={twoFactorAuth}
                        onToggle={() => setTwoFactorAuth(!twoFactorAuth)}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Change Password</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <motion.button
                        className="mt-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Update Password
                      </motion.button>
                    </div>

                    <div className="py-3 border-t border-gray-200">
                      <h3 className="font-medium text-red-600 mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Once you delete your account, there is no going back.
                      </p>
                      <motion.button
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Appearance Settings
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        <div>
                          <h3 className="font-medium">Theme Mode</h3>
                          <p className="text-sm text-gray-500">
                            {darkMode ? "Dark" : "Light"} mode is currently
                            active
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        isOn={darkMode}
                        onToggle={() => setDarkMode(!darkMode)}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Color Theme</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {["blue", "purple", "green", "red", "orange"].map(
                          (color) => (
                            <motion.div
                              key={color}
                              className={`h-12 rounded-md cursor-pointer`}
                              style={{
                                backgroundColor:
                                  color === "blue"
                                    ? "#3b82f6"
                                    : color === "purple"
                                    ? "#8b5cf6"
                                    : color === "green"
                                    ? "#10b981"
                                    : color === "red"
                                    ? "#ef4444"
                                    : "#f97316",
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Font Size</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">A</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          defaultValue="3"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg">A</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    Billing Information
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <p className="text-blue-800">
                        You are currently on the <strong>Pro Plan</strong>
                      </p>
                      <p className="text-sm text-blue-600">
                        Your subscription renews on October 24, 2025
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                        <div className="bg-gray-100 p-2 rounded">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                        <button className="ml-auto text-blue-600 text-sm hover:text-blue-800">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Billing History</h3>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Invoice
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {[
                              {
                                date: "Aug 24, 2025",
                                amount: "$29.99",
                                status: "Paid",
                              },
                              {
                                date: "Jul 24, 2025",
                                amount: "$29.99",
                                status: "Paid",
                              },
                              {
                                date: "Jun 24, 2025",
                                amount: "$29.99",
                                status: "Paid",
                              },
                            ].map((item, index) => (
                              <motion.tr
                                key={index}
                                whileHover={{ backgroundColor: "#f9fafb" }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Download
                                  </a>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
