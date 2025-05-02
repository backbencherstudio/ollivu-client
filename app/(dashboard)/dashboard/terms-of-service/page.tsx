"use client";

import React, { useState } from "react";
import { TabType, Section, INITIAL_SECTION } from "./types";
import TabHeader from "./components/TabHeader";
import AddSectionButton from "./components/AddSectionButton";
import SectionsList from "./components/SectionsList";
import EditorModal from "./components/EditorModal";
import {
  useCreateTermsMutation,
  useGetTermsQuery,
  useUpdateTermsMutation,
} from "@/src/redux/features/termsAndPrivacy/termsApi";
import { toast } from "sonner";
export default function AdminTermsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("terms");

  return (
    <div className="bg-white text-[#1D1F2C] min-h-screen px-4 md:px-12 py-10">
      <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "terms" ? <TermsContent /> : <PrivacyPolicyContent />}
    </div>
  );
}

function TermsContent() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] =
    useState<Section>(INITIAL_SECTION);
  const [isEditing, setIsEditing] = useState(false);

  // RTK Query hooks
  const [createTerms, { isLoading: isCreating }] = useCreateTermsMutation();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsMutation();
  const { data: termsData, isLoading: isLoadingTerms } =
    useGetTermsQuery(undefined);

  const handleEditorChange = (content: string) => {
    console.log("Editor Content Changed:", content);
    setCurrentSection((prev) => ({ ...prev, content }));
  };

  const handleTitleChange = (title: string) => {
    setCurrentSection((prev) => ({ ...prev, title }));
  };

  const handleEdit = (section: Section) => {
    setCurrentSection(section);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const { title, content, _id } = currentSection;
    console.log("Attempting to save section:", currentSection);

    if (!title.trim() || !content.trim()) {
      console.log("Validation Failed: Empty title or content");
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      if (isEditing && _id) {
        await updateTerms({
          _id,
          title,
          content,
        }).unwrap();
        toast.success("Terms section updated successfully!");
      } else {
        await createTerms({
          title,
          content,
        }).unwrap();
        toast.success("Terms section created successfully!");
      }

      setCurrentSection(INITIAL_SECTION);
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save terms:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} terms section`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSection(INITIAL_SECTION);
  };

  if (isLoadingTerms) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#20B894]"></div>
      </div>
    );
  }

  return (
    <>
      <AddSectionButton
        onClick={() => setIsModalOpen(true)}
        disabled={isCreating || isUpdating}
      />

      <SectionsList sections={termsData?.data || []} onEdit={handleEdit} />

      {isModalOpen && (
        <EditorModal
          section={currentSection}
          onTitleChange={handleTitleChange}
          onContentChange={handleEditorChange}
          onSave={handleSave}
          onClose={handleModalClose}
          isLoading={isCreating || isUpdating}
          isEditing={isEditing}
        />
      )}
    </>
  );
}

function PrivacyPolicyContent() {
  return <TermsContent />;
}
