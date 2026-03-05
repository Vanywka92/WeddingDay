import { useState } from 'react';
import { Modal, Form, Input, Button, ConfigProvider, message } from 'antd';
import { UserOutlined, PhoneOutlined, HeartFilled } from '@ant-design/icons';
import styles from '../styles/RSVPModal.module.css';

export default function RSVPModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: values.full_name,
          phone: values.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || 'Произошла ошибка. Попробуйте ещё раз.');
        return;
      }

      setSuccess(true);
      form.resetFields();
    } catch {
      message.error('Не удалось отправить данные. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    form.resetFields();
    onClose();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#c8a96e',
          fontFamily: "'Lato', sans-serif",
          borderRadius: 2,
          colorBorder: '#e8d9bc',
          colorBgContainer: '#faf7f2',
        },
      }}
    >
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width="min(480px, calc(100vw - 24px))"
        centered
        className={styles.modal}
        styles={{
          content: {
            borderRadius: 4,
            padding: 0,
            overflow: 'hidden',
          },
          mask: {
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(61, 53, 48, 0.55)',
          },
          wrapper: {
            padding: '0 12px',
          },
        }}
      >
        <div className={styles.modalInner}>
          {success ? (
            <SuccessView onClose={handleClose} />
          ) : (
            <FormView
              form={form}
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
}

function FormView({ form, loading, onSubmit, onCancel }) {
  return (
    <>
      <div className={styles.modalHeader}>
        <p className={styles.modalEyebrow}>Подтверждение</p>
        <h3 className={styles.modalTitle}>Я приду на свадьбу</h3>
        <p className={styles.modalSubtitle}>
          Оставьте ваши данные, чтобы мы могли вас ждать
        </p>
      </div>

      <div className={styles.modalBody}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="full_name"
            label={<span className={styles.fieldLabel}>Ваше ФИО</span>}
            rules={[
              { required: true, message: 'Пожалуйста, введите ваше ФИО' },
              { min: 2, message: 'ФИО слишком короткое' },
            ]}
          >
            <Input
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="Иванова Анна Петровна"
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<span className={styles.fieldLabel}>Номер телефона</span>}
            rules={[
              { required: true, message: 'Пожалуйста, введите номер телефона' },
              {
                pattern: /^[\+\d][\d\s\-\(\)]{6,}$/,
                message: 'Введите корректный номер телефона',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className={styles.inputIcon} />}
              placeholder="+7 (999) 123-45-67"
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <div className={styles.formActions}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className={styles.submitBtn}
              block
            >
              Подтвердить участие
            </Button>
            <button className={styles.cancelBtn} type="button" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

function SuccessView({ onClose }) {
  return (
    <div className={styles.successView}>
      <div className={styles.successIcon}>
        <HeartFilled />
      </div>
      <h3 className={styles.successTitle}>Ждём вас!</h3>
      <p className={styles.successText}>
        Спасибо за подтверждение. Мы очень рады, что вы будете с нами в этот
        особенный день.
      </p>
      <p className={styles.successDate}>15 августа 2026 · 17:00</p>
      <Button
        onClick={onClose}
        size="large"
        className={styles.closeBtn}
      >
        Закрыть
      </Button>
    </div>
  );
}
