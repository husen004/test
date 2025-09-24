"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ChevronRight, Tag, X } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readTime: number;
  image: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Future of Web Development: What to Expect in 2026",
    excerpt:
      "Explore emerging trends and technologies shaping the future of web development.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Technology",
    tags: ["Web Development", "JavaScript", "Future Tech"],
    author: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    publishDate: "September 20, 2025",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: 2,
    title: "Mastering React Hooks: Advanced Patterns for Modern Applications",
    excerpt:
      "Take your React skills to the next level with these advanced hook patterns.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Programming",
    tags: ["React", "JavaScript", "Web Development"],
    author: {
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    publishDate: "September 15, 2025",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Designing for Accessibility: Creating Inclusive User Experiences",
    excerpt: "Learn how to build websites that are accessible to everyone.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Design",
    tags: ["Accessibility", "UX Design", "Inclusive Design"],
    author: {
      name: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    publishDate: "September 10, 2025",
    readTime: 7,
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Building High-Performance APIs with Node.js and GraphQL",
    excerpt: "Optimize your backend services for speed and efficiency.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Backend",
    tags: ["Node.js", "GraphQL", "API Development"],
    author: {
      name: "Emma Davis",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    publishDate: "September 5, 2025",
    readTime: 12,
    image:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&auto=format&fit=crop&q=60",
    featured: true,
  },
  {
    id: 5,
    title: "The Complete Guide to CSS Grid Layout",
    excerpt: "Master the powerful layout system for modern web design.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Frontend",
    tags: ["CSS", "Web Design", "Layout"],
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    publishDate: "August 28, 2025",
    readTime: 9,
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 6,
    title: "Introduction to Machine Learning for Web Developers",
    excerpt:
      "Discover how to integrate ML capabilities into your web applications.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Technology",
    tags: ["Machine Learning", "AI", "Web Development"],
    author: {
      name: "Olivia Martinez",
      avatar: "https://i.pravatar.cc/150?img=20",
    },
    publishDate: "August 22, 2025",
    readTime: 11,
    image:
      "https://images.unsplash.com/photo-1535378273068-9bb67d5bb299?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 7,
    title: "Building Scalable Frontend Architecture",
    excerpt: "Best practices for structuring large-scale web applications.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Frontend",
    tags: ["Architecture", "JavaScript", "Best Practices"],
    author: {
      name: "Daniel Lee",
      avatar: "https://i.pravatar.cc/150?img=30",
    },
    publishDate: "August 15, 2025",
    readTime: 8,
    image:
      "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 8,
    title: "Optimizing Website Performance: A Comprehensive Guide",
    excerpt: "Strategies and techniques to make your website lightning-fast.",
    content: "Lorem ipsum dolor sit amet...",
    category: "Performance",
    tags: ["Web Performance", "Optimization", "User Experience"],
    author: {
      name: "Sophia Garcia",
      avatar: "https://i.pravatar.cc/150?img=25",
    },
    publishDate: "August 8, 2025",
    readTime: 10,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60",
    featured: true,
  },
];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const allCategories = [
    "All",
    ...Array.from(new Set(BLOG_POSTS.map((post) => post.category))),
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPosts(BLOG_POSTS);
      setFeaturedPosts(BLOG_POSTS.filter((post) => post.featured));
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="wrapper py-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Our Blog
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover insights, tutorials, and updates from our expert team
        </p>
      </motion.div>

      {!isLoading && featuredPosts.length > 0 && (
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    width={1200}
                    height={700}
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold tracking-wide mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold leading-tight">{post.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        width={32}
                        height={32}
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700">{post.author.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6 mb-4"></div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                      <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-12 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {(searchTerm || selectedCategory !== "All") && (
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-medium">{filteredPosts.length}</span> posts
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
              >
                <X size={14} /> Clear filters
              </button>
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.article key={post.id} variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden">
                    <Image width={1200} height={700} src={post.image} alt={post.title} className="w-full h-48 object-cover transition-transform hover:scale-105 duration-500" />
                    <div className="absolute top-2 right-2">
                      <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 text-gray-800 hover:text-blue-600 transition-colors">{post.title}</h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{post.publishDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center">
                        <Image width={32} height={32} src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full mr-2" />
                        <span className="text-sm font-medium">{post.author.name}</span>
                      </div>
                      <motion.button whileHover={{ x: 5 }} className="text-blue-600 text-sm flex items-center hover:text-blue-800">
                        Read more <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you&#39;re looking for.</p>
              <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Reset all filters
              </button>
            </motion.div>
          )}
        </>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-blue-50 rounded-xl p-8 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to our newsletter</h3>
          <p className="text-gray-600 mb-6">Stay up to date with the latest articles and news</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPage;