"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Crown,
  Building,
  Plus,
  X,
  CreditCard,
  Lock,
  Loader2,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;
type Tier = "basic" | "professional" | "agency";

interface TierOption {
  id: Tier;
  name: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
}

const tiers: TierOption[] = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Essential SEO audit for small websites",
    icon: <Zap className="h-5 w-5" />,
    features: [
      "Up to 100 pages",
      "Core technical issues",
      "Mobile-friendliness check",
      "PDF report",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "Comprehensive audit for growing businesses",
    icon: <Crown className="h-5 w-5" />,
    features: [
      "Up to 500 pages",
      "All Basic features",
      "Content analysis",
      "Competitor comparison (2)",
      "Action priority matrix",
      "30-day re-scan",
    ],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 149,
    description: "Full audit with white-label options",
    icon: <Building className="h-5 w-5" />,
    features: [
      "Up to 2,000 pages",
      "All Professional features",
      "5 competitor analysis",
      "White-label PDF",
      "API access",
      "Priority support",
    ],
  },
];

const steps = [
  { number: 1, label: "Website" },
  { number: 2, label: "Plan" },
  { number: 3, label: "Options" },
  { number: 4, label: "Payment" },
];

export function AuditWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>("professional");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");

  const selectedTierData = tiers.find((t) => t.id === selectedTier)!;

  const maxCompetitors = selectedTier === "agency" ? 5 : selectedTier === "professional" ? 2 : 0;

  const handleAddCompetitor = () => {
    if (newCompetitor && competitors.length < maxCompetitors) {
      setCompetitors([...competitors, newCompetitor]);
      setNewCompetitor("");
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Redirect to dashboard with success
    router.push("/dashboard");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return websiteUrl.length > 0;
      case 2:
        return selectedTier !== null;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors",
                  currentStep >= step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-sm mt-2",
                  currentStep >= step.number
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-full h-0.5 mx-4",
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                )}
                style={{ width: "80px" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Website URL */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold">
                  What website do you want to audit?
                </h2>
                <p className="text-muted-foreground mt-1">
                  Enter your website URL to get started
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Display Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="My Website"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A friendly name to identify this audit
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tier Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold">Choose your audit plan</h2>
                <p className="text-muted-foreground mt-1">
                  Select the level of detail you need
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      "relative p-6 rounded-lg border-2 cursor-pointer transition-all",
                      selectedTier === tier.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                    onClick={() => setSelectedTier(tier.id)}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          selectedTier === tier.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {tier.icon}
                      </div>
                      <h3 className="font-semibold">{tier.name}</h3>
                    </div>
                    <div className="mb-3">
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground">/audit</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tier.description}
                    </p>
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold">Configure your audit</h2>
                <p className="text-muted-foreground mt-1">
                  Add optional settings to enhance your report
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                {/* Competitors (for Pro and Agency) */}
                {maxCompetitors > 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Competitor Websites</Label>
                      <p className="text-sm text-muted-foreground">
                        Add up to {maxCompetitors} competitors to compare against
                      </p>
                    </div>

                    {competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={competitor} disabled className="flex-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCompetitor(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {competitors.length < maxCompetitors && (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://competitor.com"
                          value={newCompetitor}
                          onChange={(e) => setNewCompetitor(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAddCompetitor}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {maxCompetitors === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      Competitor analysis is available with Professional and
                      Agency plans.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setCurrentStep(2)}
                      className="mt-2"
                    >
                      Upgrade your plan
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold">Complete your order</h2>
                <p className="text-muted-foreground mt-1">
                  Review your audit details and proceed to payment
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                {/* Order Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Order Summary</h3>
                  <div className="flex justify-between text-sm">
                    <span>Website</span>
                    <span className="font-medium">{websiteUrl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Plan</span>
                    <span className="font-medium">{selectedTierData.name}</span>
                  </div>
                  {competitors.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Competitors</span>
                      <span className="font-medium">{competitors.length}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${selectedTierData.price}</span>
                  </div>
                </div>

                {/* Payment Form Placeholder */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Payment Details</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="card">Card Number</Label>
                      <Input
                        id="card"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Secured by Stripe. Your payment is protected.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((currentStep - 1) as Step)}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep((currentStep + 1) as Step)}
                disabled={!canProceed()}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ${selectedTierData.price}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Money-back guarantee */}
      <p className="text-center text-sm text-muted-foreground">
        100% money-back guarantee if we don&apos;t find any issues worth fixing.
      </p>
    </div>
  );
}
