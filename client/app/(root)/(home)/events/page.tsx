"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Input } from "@/shared/components/atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/ui/select";
import { Button } from "@/shared/components/atoms/ui/button";
import { MapPin, Calendar, Clock, Plus, Edit } from "lucide-react";
import { useQueryState } from "nuqs";
import { ListComponent, DeleteButton } from "@/shared/components/atoms/crud";
import Image from "next/image";
import type { EventWithId } from "@/features/event/event.schema";
import { eventCrudService } from "@/features/event/event.service";

function EventCard({ event }: { event: EventWithId }) {
  const startDate = event.startDate instanceof Date ? event.startDate : new Date(event.startDate);
  const endDate = event.endDate instanceof Date ? event.endDate : new Date(event.endDate);
  const now = new Date();

  const isUpcoming = startDate > now;
  const isPast = endDate < now;
  const isActive = !isPast && !isUpcoming;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white/70" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={`font-medium ${
            isPast ? "bg-gray-100 text-gray-800" :
            isActive ? "bg-green-100 text-green-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {isPast ? "Terminé" : isActive ? "En cours" : "À venir"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900 font-bold">
            Gratuit
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {event.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Début : {startDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
          {event.endDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Fin : {endDate.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/events/${event.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Link>
          </Button>
          <DeleteButton
            service={eventCrudService}
            queryKey={['events']}
            itemId={event.id}
            itemLabel={event.name}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function EventFilters() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [location, setLocation] = useQueryState("location", { defaultValue: "all" });
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un événement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lieu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les lieux</SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="lyon">Lyon</SelectItem>
            <SelectItem value="marseille">Marseille</SelectItem>
            <SelectItem value="bordeaux">Bordeaux</SelectItem>
            <SelectItem value="lille">Lille</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function EventsCrudPage() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const [location] = useQueryState("location", { defaultValue: "all" });
  
  const filters = {
    search,
    ...(location !== "all" ? { location } : {}),
  };
  
  return (
    <div className="container mx-auto py-6">
      <ListComponent<EventWithId>
        service={eventCrudService}
        queryKey={['events']}
        filters={filters}
        renderFilters={() => <EventFilters />}
        renderHeader={() => (
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Créer un événement
              </Link>
            </Button>
          </div>
        )}
        renderItem={(event) => <EventCard event={event} />}
        gridCols={4}
      />
    </div>
  );
}
