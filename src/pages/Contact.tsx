import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Contact } from '@/components/Contact';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGallery } from '@/contexts/GalleryContext';
import { toast } from 'sonner';

const ContactPage = () => {
    const { addMessage } = useGallery();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Project Consultation',
        message: ''
    });
    
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'quote') {
            setFormData(prev => ({ ...prev, inquiryType: 'Institutional Quote' }));
        } else if (type === 'consultation') {
            setFormData(prev => ({ ...prev, inquiryType: 'Project Consultation' }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');
        
        try {
            // Backend Integration via GalleryContext (Django)
            await addMessage({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: `${formData.inquiryType}: ${formData.message}`,
            });

            setStatus('success');
            toast.success("Inquiry Sent Successfully");
            setFormData({ name: '', email: '', phone: '', inquiryType: 'Project Consultation', message: '' });
        } catch (error: unknown) {
            console.error('Submission error:', error);
            setStatus('error');
            
            // Extract error message from Django response if available
            const axiosError = error as { response?: { data?: Record<string, string[]> } };
            const backendError = axiosError.response?.data;
            if (backendError) {
                const firstError = Object.values(backendError)[0];
                setErrorMessage(Array.isArray(firstError) ? firstError[0] : "Validation error occurred.");
            } else {
                setErrorMessage('We encountered an issue submitting your request. Please try contacting us directly.');
            }
        }
    };

    return (
        <>
            <SEO 
                title="Contact Us | Inquiry & Support" 
                description="Get in touch with the MH Marble curation team. Request consultations, quotes, or bespoke stone sourcing for your architectural projects."
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Contact', item: '/contact' }
                ]}
            />
            <PageLayout
                title="Contact Us."
                subtitle="Inquiry & Support"
            >
            <div className="space-y-32 md:space-y-48 pb-20">
                {/* Form Section */}
                <section className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 md:gap-32">
                    <div className="lg:w-5/12">
                        <span className="text-[10px] font-sans font-bold tracking-[0.6em] uppercase text-accent mb-8 block">Reach Out</span>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light leading-[0.9] tracking-tighter mb-8 text-foreground">
                            Get in <br />
                            <span className="italic">Touch.</span>
                        </h2>
                        <p className="text-base md:text-xl font-sans font-light text-foreground/70 leading-relaxed max-w-md">
                            Our team is available for consultations at our gallery or via digital inquiry. Submit your details below, and a representative will respond to you shortly.
                        </p>
                    </div>

                    <div className="lg:w-7/12 relative bg-foreground/[0.02] p-8 md:p-16 border border-border/40">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                                <CheckCircle2 className="w-16 h-16 text-accent mb-6" />
                                <h3 className="text-3xl font-serif font-light text-foreground mb-4">Message Received.</h3>
                                <p className="text-foreground/60 font-sans font-light">Our team will contact you within 24 hours.</p>
                                <Button 
                                    onClick={() => setStatus('idle')}
                                    variant="outline" 
                                    className="mt-10 tracking-[0.3em] font-sans text-[10px] uppercase rounded-none"
                                >
                                    Submit Another
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-foreground/50">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-border/60 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-serif italic"
                                        placeholder="John Doe"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-foreground/50">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-border/60 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-serif italic"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-foreground/50">Phone Number</label>
                                        <input 
                                            required
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-border/60 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-serif italic"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-foreground/50">Inquiry Type</label>
                                    <select 
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-border/60 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-serif italic appearance-none cursor-pointer"
                                    >
                                        <option value="Project Consultation">Project Consultation</option>
                                        <option value="Institutional Quote">Institutional Quote</option>
                                        <option value="Bespoke Sourcing">Bespoke Sourcing</option>
                                        <option value="Gallery Visit">Gallery Visit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-foreground/50">Message</label>
                                    <textarea 
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-transparent border-b border-border/60 py-4 text-foreground text-lg focus:outline-none focus:border-accent transition-colors font-serif italic resize-none"
                                        placeholder="Please describe your project or requirements..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-sans italic">{errorMessage}</p>
                                )}

                                <Button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="w-full bg-foreground hover:bg-accent text-background hover:text-accent-foreground rounded-none h-16 font-sans font-bold tracking-[0.5em] text-[11px] uppercase transition-all duration-700 mt-8 group"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-4">
                                            Send Message
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </section>

                <Contact />
            </div>
        </PageLayout>
    </>
  );
};

export default ContactPage;
