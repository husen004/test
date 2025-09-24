'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, MapPin, Filter } from 'lucide-react'


interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  location: string
  avatar: string
}

const USERS: User[] = [
	{
		id: 1,
		name: 'Alex Johnson',
		email: 'alex@example.com',
		role: 'Admin',
		status: 'Active',
		location: 'New York',
		avatar: 'https://i.pravatar.cc/150?img=1',
	},
	{
		id: 2,
		name: 'Sarah Williams',
		email: 'sarah@example.com',
		role: 'Editor',
		status: 'Active',
		location: 'London',
		avatar: 'https://i.pravatar.cc/150?img=5',
	},
	{
		id: 3,
		name: 'Michael Brown',
		email: 'michael@example.com',
		role: 'User',
		status: 'Inactive',
		location: 'Toronto',
		avatar: 'https://i.pravatar.cc/150?img=8',
	},
	{
		id: 4,
		name: 'Emma Davis',
		email: 'emma@example.com',
		role: 'Admin',
		status: 'Active',
		location: 'Sydney',
		avatar: 'https://i.pravatar.cc/150?img=9',
	},
	{
		id: 5,
		name: 'James Wilson',
		email: 'james@example.com',
		role: 'User',
		status: 'Active',
		location: 'Berlin',
		avatar: 'https://i.pravatar.cc/150?img=12',
	},
	{
		id: 6,
		name: 'Olivia Martinez',
		email: 'olivia@example.com',
		role: 'Editor',
		status: 'Inactive',
		location: 'Paris',
		avatar: 'https://i.pravatar.cc/150?img=20',
	},
	{
		id: 7,
		name: 'Daniel Lee',
		email: 'daniel@example.com',
		role: 'User',
		status: 'Active',
		location: 'Tokyo',
		avatar: 'https://i.pravatar.cc/150?img=30',
	},
	{
		id: 8,
		name: 'Sophia Garcia',
		email: 'sophia@example.com',
		role: 'Admin',
		status: 'Active',
		location: 'Madrid',
		avatar: 'https://i.pravatar.cc/150?img=25',
	},
]

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [selectedRole, setSelectedRole] = useState<string>('All')

	useEffect(() => {
		const fetchUsers = async () => {
			// Simulate network delay
			await new Promise((resolve) => setTimeout(resolve, 1200))
			setUsers(USERS)
			setIsLoading(false)
		}

		fetchUsers()
	}, [])

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.location.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesRole = selectedRole === 'All' || user.role === selectedRole

		return matchesSearch && matchesRole
	})

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	} as const

	const headerVariants = {
		hidden: { y: -50, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				delay: 0.2,
			},
		},
	} as const

	return (
		<div className="wrapper p-8 rounded-2xl">
			<motion.div
				initial="hidden"
				animate="visible"
				variants={headerVariants}
				className="mb-8"
			>
				<h1 className="text-3xl font-bold text-gray-800 mb-2">Users</h1>
				<p className="text-gray-600">
					Manage your team members and their account permissions here
				</p>
			</motion.div>

			<div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
				<div className="p-5 border-b border-gray-200">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="relative w-full md:w-64">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search size={18} className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search users..."
								className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>


						<div className="flex items-center gap-2">
							<Filter size={18} className="text-gray-500" />
							<select
								className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={selectedRole}
								onChange={(e) => setSelectedRole(e.target.value)}
							>
								<option value="All">All Roles</option>
								<option value="Admin">Admin</option>
								<option value="Editor">Editor</option>
								<option value="User">User</option>
							</select>
						</div>
					</div>
				</div>

				{isLoading ? ( 
					<div className="p-5">
						{[...Array(5)].map((_, i) => (
							<div
								key={i}
								className="animate-pulse flex items-center space-x-4 mb-5"
							>
								<div className="rounded-full bg-slate-200 h-12 w-12"></div>
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-slate-200 rounded w-1/4"></div>
									<div className="h-3 bg-slate-200 rounded w-1/3"></div>
								</div>
								<div className="h-3 bg-slate-200 rounded w-1/5"></div>
							</div>
						))}
					</div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="divide-y divide-gray-200"
					>
						{filteredUsers.length > 0 ? (
							filteredUsers.map((user) => (
								<motion.div
									key={user.id}
									variants={itemVariants}
									whileHover={{ backgroundColor: '#f9fafb' }}
									className="p-5 flex flex-col sm:flex-row sm:items-center gap-4"
								>
									<div className="flex-shrink-0">
										<motion.img
											whileHover={{ scale: 1.1 }}
											src={user.avatar}
											alt={user.name}
											className="w-12 h-12 rounded-full object-cover"
										/>
									</div>

									<div className="flex-grow">
										<h3 className="font-medium text-gray-800">
											{user.name}
										</h3>
										<div className="flex items-center gap-2 text-gray-500 text-sm">
											<Mail size={14} />
											<span>{user.email}</span>
										</div>
									</div>

									<div className="flex flex-col sm:items-end">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{user.role}
										</span>
										<div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
											<MapPin size={14} />
											<span>{user.location}</span>
										</div>
									</div>

									<div>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												user.status === 'Active'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}
										>
											{user.status}
										</span>
									</div>
								</motion.div>
							))
						) : (
							<motion.div
								variants={itemVariants}
								className="p-8 text-center text-gray-500"
							>
								No users found matching your filters
							</motion.div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	)
}

export default UsersPage