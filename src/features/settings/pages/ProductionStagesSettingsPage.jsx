import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Modal } from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { PageHeader } from '@/components/common/PageHeader/PageHeader';
import { SettingsSubNav } from '../components/SettingsSubNav';
import { StageDragItem } from '../components/StageDragItem';
import { MOCK_PRODUCTION_STAGES } from '../constants/settings.mock';
import { notifySuccess } from '@/services/notification.service';
import { ERP_ICONS } from '@/shared/icons';

export const ProductionStagesSettingsPage = () => {
  const [stages, setStages] = useState(MOCK_PRODUCTION_STAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        notifySuccess("Texnologik bosqichlar ketma-ketligi yangilandi.");
        return reordered;
      });
    }
  };

  return (
    <div className="production-stages-settings-page animate-fade-in pb-5">
      <SettingsSubNav />

      <PageHeader
        title="Ishlab Chiqarish Texnologik Bosqichlari"
        subtitle="Sex zanjiri ketma-ketligi va standart bosqich narxlari. Elementlarni tortib tartibni o'zgartiring."
        breadcrumbs={[
          { label: 'Bosh sahifa', path: '/' },
          { label: 'Sozlamalar', path: '/settings' },
          { label: 'Bosqichlar' },
        ]}
        actions={
          <Button variant="primary" size="sm" icon={ERP_ICONS.PLUS} onClick={() => setIsModalOpen(true)}>
            Yangi Bosqich Qo'shish
          </Button>
        }
      />

      <Card title="Texnologik Ketma-ketlik va Bosqichlar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="stages-list py-2">
              {stages.map((stage, idx) => (
                <StageDragItem key={stage.id} stage={stage} index={idx} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Texnologik Bosqich Yaratish"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                notifySuccess("Yangi texnologik bosqich qo'shildi.");
                setIsModalOpen(false);
              }}
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Input label="Bosqich Nomi (masalan: Tokarlik ishlovi)" placeholder="Tokarlik ishlovi" />
        <Input label="Tavsifi" placeholder="Detallarga tokarlik stanogida ishlov berish" />
        <Input label="Standart Me'yor Narxi ($)" placeholder="25.00" type="number" />
        <Input label="Rang kodi (#3b82f6)" defaultValue="#3b82f6" />
      </Modal>
    </div>
  );
};
