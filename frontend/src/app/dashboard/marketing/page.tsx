"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import axios from "axios";

interface MarketingPost {
    id: number;
    platform: string;
    post_date: string | null;
    content_type: string | null;
    description: string | null;
    engagement: number | null;
    sales_from_post: number | null;
    notes: string | null;
}

interface MarketingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    post: MarketingPost | null;
}

function MarketingModal({ isOpen, onClose, onSave, post }: MarketingModalProps) {
    const [formData, setFormData] = useState({
        platform: "",
        post_date: "",
        content_type: "",
        description: "",
        engagement: "",
        sales_from_post: "",
        notes: ""
    });

    useEffect(() => {
        if (post) {
            setFormData({
                platform: post.platform || "",
                post_date: post.post_date || "",
                content_type: post.content_type || "",
                description: post.description || "",
                engagement: post.engagement?.toString() || "",
                sales_from_post: post.sales_from_post?.toString() || "",
                notes: post.notes || ""
            });
        } else {
            setFormData({
                platform: "",
                post_date: "",
                content_type: "",
                description: "",
                engagement: "",
                sales_from_post: "",
                notes: ""
            });
        }
    }, [post, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const payload = {
            platform: formData.platform,
            post_date: formData.post_date || null,
            content_type: formData.content_type || null,
            description: formData.description || null,
            engagement: formData.engagement ? parseInt(formData.engagement) : null,
            sales_from_post: formData.sales_from_post ? parseFloat(formData.sales_from_post) : null,
            notes: formData.notes || null
        };

        try {
            if (post) {
                await axios.put(`${url}/marketing/${post.id}`, payload);
            } else {
                await axios.post(`${url}/marketing/`, payload);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to save marketing post:", error);
            alert("Failed to save marketing post");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {post ? "Edit Marketing Post" : "Add Marketing Post"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Platform <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                                required
                            >
                                <option value="">Select Platform</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Twitter">Twitter</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="TikTok">TikTok</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Post Date</label>
                            <input
                                type="date"
                                value={formData.post_date}
                                onChange={(e) => setFormData({ ...formData, post_date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Content Type</label>
                        <select
                            value={formData.content_type}
                            onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                        >
                            <option value="">Select Content Type</option>
                            <option value="Image">Image</option>
                            <option value="Video">Video</option>
                            <option value="Story">Story</option>
                            <option value="Carousel">Carousel</option>
                            <option value="Reel">Reel</option>
                            <option value="Text">Text Post</option>
                            <option value="Link">Link</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                            rows={3}
                            placeholder="Brief description of the post content..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Engagement (Likes/Comments)
                            </label>
                            <input
                                type="number"
                                value={formData.engagement}
                                onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Sales from Post (₦)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.sales_from_post}
                                onChange={(e) => setFormData({ ...formData, sales_from_post: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                                placeholder="0.00"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium text-gray-900"
                            rows={2}
                            placeholder="Additional notes or observations..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold transition-colors"
                        >
                            {post ? "Update Post" : "Add Post"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MarketingPage() {
    const [posts, setPosts] = useState<MarketingPost[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<MarketingPost | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await axios.get(`${url}/marketing/`);
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch marketing posts:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            await axios.delete(`${url}/marketing/${id}`);
            fetchPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post");
        }
    };

    const handleEdit = (post: MarketingPost) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedPost(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Marketing Tracker</h1>
                        <p className="text-gray-700 mt-1 font-medium">Track social media posts and their performance</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-bold transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Post
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Platform</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Post Date</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Content Type</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Engagement</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Sales (₦)</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Notes</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 font-medium">
                                        No marketing posts yet. Click "Add Post" to get started.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.platform}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {post.post_date || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {post.content_type || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                                            {post.description || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {post.engagement?.toLocaleString() || "0"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {post.sales_from_post ? `₦${post.sales_from_post.toLocaleString()}` : "₦0"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                                            {post.notes || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <MarketingModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={fetchPosts}
                post={selectedPost}
            />
        </div>
    );
}
